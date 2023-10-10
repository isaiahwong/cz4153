// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IAuction.sol";

interface IRegistrar is IAuction {
    event DomainRegistered(
        address indexed owner,
        bytes32 indexed tldHash,
        bytes32 indexed domainHash,
        string tld,
        string domain,
        uint256 expires,
        uint256 cost
    );

    event DomainBidFailed(
        address indexed owner,
        bytes32 indexed tldHash,
        bytes32 indexed domainHash,
        string tld,
        string domain,
        uint256 expires,
        uint256 refund,
        uint256 highestBid
    );

    function expiry(bytes32 domain) external view returns (uint256);

    function commit(bytes32 domain, bytes32 secret) external payable returns (bytes32);

    function revealRegister(string calldata domain, bytes32 secret, uint256 value) external returns (bool);

    function setCName(string memory domain) external;

    function hasDomainExpired(bytes32 domain) external view returns (bool);

    function makeDomainCommitment(bytes32 domain, bytes32 secret, uint256 value) external view returns (bytes32);

    function hasDomainCommitment(bytes32 domain, bytes32 secret, uint256 value) external view returns (bool);

//    function cname(bytes32 domain) external view returns (address);
}
