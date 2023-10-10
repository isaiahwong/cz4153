// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IRegistrar.sol";
import "./Auction.sol";
import "./Errors.sol";
import "../registry/IDNS.sol";

import "hardhat/console.sol";

contract Registrar is ERC721, Auction, IRegistrar, Ownable {

    IDNS private dns;

    bytes32 private tld;

    uint256 private TENURE = 365 days;
    uint256 private GRACE_PERIOD = 90 days;

    // domain to expiry times
    mapping(bytes32 => uint256) private expiries;

    // domain to monotonic increasing version
    mapping(bytes32 => uint256) private versions;

    // authorized addresses
    mapping(address => bool) private authorized;

    modifier auth(bytes32 domain) {
        require(isAuthorized(domain));
        _;
    }

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
        if (authorized[msg.sender]) {
            return true;
        }

        if (hasDomainExpired(domain)) {
            return false;
        }

        return dns.addr(dns.makeDomain(tld, domain)) == msg.sender;
    }

    function auctionDeadline(bytes32 domain) public override (IAuction, Auction) view virtual returns (uint256) {
        return Auction.auctionDeadline(getDomainCurrentVersion(domain));
    }

    function getTLD() public view returns (bytes32) {
        return tld;
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

    function hasDomainCommitment(bytes32 domain, bytes32 secret, uint256 value) public view returns (bool) {
        return hasCommitment(makeCommitment(msg.sender, getDomainCurrentVersion(domain), secret, value));
    }

    function setCName(string memory domain) external auth(keccak256(abi.encodePacked(domain))) {
        dns.setCName(tld, domain, msg.sender);
    }


    /**
     * @dev canCommit returns true when either the domain has expired or an ongoing auction has happening
     */
    function canCommit(bytes32 domain) public view returns (bool) {
        return hasDomainExpired(domain) || !hasAuctionExpired(getDomainCurrentVersion(domain));
    }

    /**
     * @dev commit commits a domain to an auction.
     * When the first commit happens, a new expiry time is set.
     * This is to ensure that in the event where a domain is not revealed, it will
     * still be available for renewal.
     */
    function commit(bytes32 domain, bytes32 secret) public payable returns (bytes32) {
        // Check if the name is available
        if (!canCommit(domain)) {
            revert Errors.DomainNotExpired();
        }

        // Set new expiry time if it expired
        if (hasDomainExpired(domain)) {
            // Increment version
            versions[domain] += 1;

            // Set expiry time to duration of auction
            expiries[domain] = block.timestamp + TENURE + getAuctionDuration();
        }

        bytes32 commitment = makeDomainCommitment(domain, secret, msg.value);

        // Commit the bid
        commitBid(getDomainCurrentVersion(domain), commitment);
        return commitment;
    }

    function revealRegister(string calldata domain, bytes32 secret, uint256 value) public returns (bool) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));

        (bool bidSuccess, uint256 refund) = revealAuction(
            getDomainCurrentVersion(domainHash),
            secret,
            value
        );

        // Return if bid was unsuccessful
        if (!bidSuccess) {
            emit DomainBidFailed(
                msg.sender,
                keccak256(abi.encodePacked(name())),
                domainHash,
                name(),
                domain,
                expiries[domainHash],
                refund,
                auctionHighestBid(getDomainCurrentVersion(domainHash))
            );
            return bidSuccess;
        }

        uint256 id = uint256(domainHash);

        // Burn domain if exists prior
        if (_exists(id)) {
            _burn(id);
        }
        _mint(msg.sender, id);
        dns.setSubDomain(tld, domain, msg.sender);

        emit DomainRegistered(msg.sender, keccak256(abi.encodePacked(name())), domainHash, name(), domain, expiries[domainHash], auctionHighestBid(getDomainCurrentVersion(domainHash)));

        return bidSuccess;
    }

}
