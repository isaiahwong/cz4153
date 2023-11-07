// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IRegistrar.sol";
import "./Auction.sol";
import "./Errors.sol";
import "../registry/IDNS.sol";

import "hardhat/console.sol";

/**
 * @dev Implementation of the {IRegistrar} interface. The Registrar  contract is a ERC721 contract that manages
 * the registration of its domains under its TLD. It inherits from the Auction contract which
 * handles the bidding process.
 */
contract Registrar is ERC721, Auction, IRegistrar, Ownable {

    // Stores a reference to the DNSRegistry contract
    IDNS private dns;

    // The top level domain hash
    bytes32 private tld;

    // Tenure of a domain
    uint256 private TENURE = 365 days;

    // Grace period for rebidding a domain
    uint256 private GRACE_PERIOD = 90 days;

    // Minimum bid for a domain
    uint256 constant public MIN_BID = 0.003 ether;

    // Stores domain hash to expiry times
    mapping(bytes32 => uint256) private expiries;

    // Stores domain hash to monotonic increasing versions
    mapping(bytes32 => uint256) private versions;

    // Whitelisted authorized addresses
    mapping(address => bool) private authorized;

    // Stores commitment to domain
    mapping(address => mapping(bytes32 => uint256)) private precommitments;

    /**
     * @dev Modifier that checks if the caller is whitelisted.
     */
    modifier auth(bytes32 domain) {
        require(isAuthorized(domain));
        _;
    }

    /**
     * @dev Initializes the contract by initializing the NFT contract and auction contract.this
     * It stores the top level domain hash and the DNSRegistry contract address.
     */
    constructor(
        string memory name,
        string memory symbol,
        bytes32 _tld,
        uint256 _auctionDuration,
        address _dns
    ) ERC721(name, symbol) Auction(_auctionDuration) {
        tld = _tld;
        dns = IDNS(_dns);
    }

    function isAuthorized(bytes32 domain) public view returns (bool) {
        if (authorized[msg.sender]) return true;
        if (hasDomainExpired(domain)) return false;
        return dns.addr(dns.makeDomain(tld, domain)) == msg.sender;
    }

    function setDuration(uint256 duration) external onlyOwner {
        Auction._setDuration(duration);
    }

    function auctionDeadline(bytes32 domain) public override (IAuction, Auction) view virtual returns (uint256) {
        return Auction.auctionDeadline(getDomainCurrentVersion(domain));
    }

    function expiry(bytes32 domain) public view returns (uint256) {
        return expiries[domain];
    }

    function hasDomainExpired(bytes32 domain) public view returns (bool) {
        return expiries[domain] + GRACE_PERIOD < block.timestamp;
    }

    function getDomainCurrentVersion(bytes32 domain) public view returns (bytes32) {
        return keccak256(abi.encodePacked(domain, versions[domain]));
    }

    function makeDomainCommitment(bytes32 domain, bytes32 secret, uint256 value) public view returns (bytes32) {
        return makeCommitment(msg.sender, getDomainCurrentVersion(domain), secret, value);
    }

    /**
     * @dev Returns a future version of the domain hash if the domain has expired.
     */
    function getDomainFutureVersion(bytes32 domain) public view returns (bytes32) {
        if (hasDomainExpired(domain)) return keccak256(abi.encodePacked(domain, versions[domain] + 1));
        return getDomainCurrentVersion(domain);
    }

    function makeDomainPreCommitment(bytes32 domain, bytes32 secret) public view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, getDomainFutureVersion(domain), secret));
    }

    /**
     * @dev sets the canonical name for an address.
     */
    function setCName(string memory domain) external auth(keccak256(abi.encodePacked(domain))) {
        dns.setCName(tld, string(abi.encodePacked(domain, ".", name())), msg.sender);
    }

    /**
     * @dev canCommit returns true when either the domain has expired or an ongoing auction has happening
     */
    function canCommit(bytes32 domain) public view returns (bool) {
        return hasDomainExpired(domain) || !hasAuctionExpired(getDomainCurrentVersion(domain));
    }

    /**
     * @dev precommit submits a bid bind to a commitment
     * @param precommitment Hash commitment. Scheme is keccak256(abi.encodePacked(msg.sender, versions[domain], secret))
     */
    function precommit(bytes32 precommitment) public payable {
        if (msg.value < MIN_BID) {
            revert Errors.InsufficientBid();
        }
        precommitments[msg.sender][precommitment] = msg.value;
    }

    function refundPrecommitment(bytes32 precommitment) public {
        uint256 value = precommitments[msg.sender][precommitment];
        if (value == 0) {
            revert Errors.CommitmentDoesNotExist();
        }
        precommitments[msg.sender][precommitment] = 0;
        payable(msg.sender).transfer(value);
    }

    /**
     * @dev commit commits a domain to an auction.
     * When the first commit happens, a new expiry time is set.
     * This is to ensure that in the event where a domain is not revealed, it will
     * still be available for renewal.
     * @param domain The plaintext domain to commit
     * @param secret The secret hash to commit.
     */
    function commit(string calldata domain, bytes32 secret) public {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));

        // Create precommitment
        bytes32 precommitment = makeDomainPreCommitment(domainHash, secret);

        // verify commitment
        if (precommitments[msg.sender][precommitment] < MIN_BID) {
            revert Errors.InsufficientBid();
        }

        // Check if the name is available
        if (!canCommit(domainHash)) {
            revert Errors.DomainNotExpired();
        }

        // Set new expiry time if it expired
        if (hasDomainExpired(domainHash)) {
            // Increment version
            versions[domainHash] += 1;

            // Set expiry time to duration of auction
            expiries[domainHash] = block.timestamp + TENURE + getAuctionDuration();
            emit DomainAuctionStarted(domainHash, name(), domain, getAuctionDuration(), block.timestamp + getAuctionDuration());
        }

        // Create commitment
        bytes32 commitment = makeDomainCommitment(domainHash, secret, precommitments[msg.sender][precommitment]);

        // Commit the bid
        commitBid(getDomainCurrentVersion(domainHash), commitment, precommitments[msg.sender][precommitment]);

        // remove precommitment
        precommitments[msg.sender][precommitment] = 0;
    }

    /**
     * @dev batchCommit reveals multiple domain bids for the same domain
     * @param domain The domain to reveal
     * @param commitments The commitments submitted.
     */
    function batchRevealRegister(string calldata domain, CommitParam[] calldata commitments) public {
        // Accumulate refund
        Result memory result;
        bytes32 domainHash = keccak256(abi.encodePacked(domain));

        result.success = true;

        for (uint256 i = 0; i < commitments.length; i++) {
            Result memory res = revealRegister(domain, commitments[i], false);
            result.refund += res.refund;
            result.highestCommitment = res.highestCommitment;

            if (!res.success) {
                result.success = false;
            }
        }

        if (!result.success) {
            emit DomainBidFailed(
                msg.sender,
                keccak256(abi.encodePacked(name())),
                domainHash,
                name(),
                domain,
                expiries[domainHash],
                result.refund,
                auctionHighestBid(getDomainCurrentVersion(domainHash)),
                result.highestCommitment
            );
        }
    }

    function revealRegister(string calldata domain, CommitParam calldata param) public returns (bool) {
        return revealRegister(domain, param, true).success;
    }

    /**
     * @dev Takes in a domain, plaintext secret and value and reveals the bid.
     * Secret is hashed and commitment is reconstructed to ensure that the bid is valid.
     * @param domain The domain to reveal.
     * @param param Commitment parameters
     */
    function revealRegister(string calldata domain, CommitParam calldata param, bool emitFailure) internal returns (Result memory) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));

        Result memory result = revealAuction(
            getDomainCurrentVersion(domainHash),
            keccak256(abi.encodePacked(param.secret)),
            param.value
        );

        // Return if bid was unsuccessful
        if (result.success) {
            uint256 id = uint256(domainHash);

            // Burn domain if exists prior
            if (_exists(id)) {
                _burn(id);
            }
            // Mint domain
            _mint(msg.sender, id);

            // Set domain owner
            dns.setSubDomain(tld, domain, msg.sender);

            // Emit event
            emit DomainRegistered(
                msg.sender,
                keccak256(abi.encodePacked(name())),
                domainHash,
                name(),
                domain,
                expiries[domainHash],
                auctionHighestBid(getDomainCurrentVersion(domainHash)),
                block.timestamp
            );
        } else if (emitFailure) {
            emit DomainBidFailed(
                msg.sender,
                keccak256(abi.encodePacked(name())),
                domainHash,
                name(),
                domain,
                expiries[domainHash],
                result.refund,
                auctionHighestBid(getDomainCurrentVersion(domainHash)),
                result.highestCommitment
            );
        }

        return result;
    }
}
