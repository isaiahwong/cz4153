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

    // subdomain to expiry times
    mapping(bytes32 => uint256) private expiries;

    // subdomain to monotonic increasing version
    mapping(bytes32 => uint256) private versions;

    // authorized addresses
    mapping(address => bool) private authorized;

    modifier auth() {
        require(authorized[msg.sender]);
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

    function getTLD() public view returns (bytes32) {
        return tld;
    }

    function hasSubdomainExpired(bytes32 subdomain) public view returns (bool) {
        return expiries[subdomain] + GRACE_PERIOD < block.timestamp;
    }

    function getSubdomainCurrentVersion(bytes32 subdomain) public view returns (bytes32) {
        return keccak256(abi.encodePacked(subdomain, versions[subdomain]));
    }

    function makeSubdomainCommitment(bytes32 subdomain, bytes32 secret, uint256 value) public view returns (bytes32) {
        return makeCommitment(msg.sender, getSubdomainCurrentVersion(subdomain), secret, value);
    }

    /**
     * @dev canCommit returns true when either the domain has expired or an ongoing auction has happening
     */
    function canCommit(bytes32 subdomain) public view returns (bool) {
        return hasSubdomainExpired(subdomain) || !hasAuctionExpired(getSubdomainCurrentVersion(subdomain));
    }

    /**
     * @dev commit commits a subdomain to an auction.
     * When the first commit happens, a new expiry time is set.
     * This is to ensure that in the event where a subdomain is not revealed, it will
     * still be available for renewal.
     */
    function commit(bytes32 subdomain, bytes32 secret) public payable returns (bytes32) {
        // Check if the name is available
        if (!canCommit(subdomain)) {
            revert Errors.DomainNotExpired();
        }

        // Set new expiry time if it expired
        if (hasSubdomainExpired(subdomain)) {
            // Increment version
            versions[subdomain] += 1;

            // Set expiry time to duration of auction
            expiries[subdomain] = block.timestamp + TENURE + getAuctionDuration();
        }

        bytes32 commitment = makeSubdomainCommitment(subdomain, secret, msg.value);

        // Commit the bid
        commitBid(getSubdomainCurrentVersion(subdomain), commitment);
        return commitment;
    }

    function revealRegister(string calldata subdomainPlainText, bytes32 secret, uint256 value) public returns (bool) {
        bytes32 subdomainHash = keccak256(abi.encodePacked(subdomainPlainText));

        bool bidSuccess = revealAuction(
            getSubdomainCurrentVersion(subdomainHash),
            secret,
            value
        );

        // Return if bid was unsuccessful
        if (!bidSuccess) {
            return bidSuccess;
        }

        uint256 id = uint256(subdomainHash);

        // Burn subdomain if exists prior
        if (_exists(id)) {
            _burn(id);
        }
        _mint(msg.sender, id);
        dns.setSubDomain(tld, subdomainPlainText, msg.sender);

        emit SubdomainRegistered(msg.sender, name(), subdomainPlainText, expiries[subdomainHash], auctionHighestBid(subdomainHash));

        return bidSuccess;
    }

}
