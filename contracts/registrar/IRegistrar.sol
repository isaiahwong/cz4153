// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IAuction.sol";

interface IRegistrar is IAuction {
    struct CommitParam {
        string secret;
        uint256 value;
    }

    event DomainAuctionStarted(
        bytes32 indexed domainHash,
        string tld,
        string domain,
        uint256 duration,
        uint256 deadline
    );

    event DomainRegistered(
        address indexed owner,
        bytes32 indexed tldHash,
        bytes32 indexed domainHash,
        string tld,
        string domain,
        uint256 expires,
        uint256 cost,
        uint256 timestamp
    );

    event DomainBidFailed(
        address indexed owner,
        bytes32 indexed tldHash,
        bytes32 indexed domainHash,
        string tld,
        string domain,
        uint256 expires,
        uint256 refund,
        uint256 highestBid,
        bytes32 highestCommitment
    );

    function expiry(bytes32 domain) external view returns (uint256);

    function precommit(bytes32 precommitment) external payable;

    function commit(string calldata domain, bytes32 secret) external;
    
    function batchRevealRegister(string calldata domain, CommitParam[] calldata commitments) external;

    function revealRegister(string calldata domain, CommitParam calldata param) external returns (bool);

    function setCName(string memory domain) external;

    function hasDomainExpired(bytes32 domain) external view returns (bool);

    function getDomainCurrentVersion(bytes32 domain) external view returns (bytes32);

    function makeDomainCommitment(bytes32 domain, bytes32 secret, uint256 value) external view returns (bytes32);

    function getDomainFutureVersion(bytes32 domain) external view returns (bytes32);

    function makeDomainPreCommitment(bytes32 domain, bytes32 secret) external view returns (bytes32);
}
