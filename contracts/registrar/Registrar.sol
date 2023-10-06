// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Auction.sol";
import "./Errors.sol";

contract Registrar is ERC721, Auction, Ownable {
    bytes32 public tld;

    uint256 public TENURE = 365 days;
    uint256 public GRACE_PERIOD = 90 days;

    // subdomain to expiry times
    mapping(bytes32 => uint256) expiries;

    // subdomain to version
    mapping(bytes32 => uint256) versions;

    // authorized addresses
    mapping(address => bool) public authorized;


    modifier auth() {
        require(authorized[msg.sender]);
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        string memory _tld,
        uint256 _auctionDuration
    ) ERC721(name, symbol) Auction(_auctionDuration) {
        tld = keccak256(abi.encodePacked(_tld));
    }

    function hasSubdomainExpired(bytes32 subdomain) public view returns (bool) {
        return expiries[subdomain] + GRACE_PERIOD < block.timestamp;
    }

    function getSubdomain(bytes32 subdomain) public view returns (bytes32) {
        return keccak256(abi.encodePacked(subdomain, versions[subdomain]));
    }

    function makeSubdomainCommitment(bytes32 subdomain, bytes32 secret, uint256 value) public view returns (bytes32) {
        return makeCommitment(msg.sender, getSubdomain(subdomain), secret, value);
    }

    function commit(bytes32 subdomain, bytes32 commitment) public payable {
        // Check if the name is available
        if (!hasSubdomainExpired(subdomain)) {
            revert Errors.DomainNotExpired();
        }

        // Set expiry time to duration of auction
        expiries[getSubdomain(subdomain)] = block.timestamp + TENURE + getAuctionDuration();

        // Commit the bid
        commitBid(getSubdomain(subdomain), commitment);
    }

    function revealRegister(bytes32 subdomain, bytes32 secret, uint256 value) public returns (bool) {
        return revealAuction(
            getSubdomain(subdomain),
            secret,
            value
        );
    }

}
