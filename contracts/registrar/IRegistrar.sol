// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IAuction.sol";

interface IRegistrar is IAuction {
    event SubdomainRegistered(
        address indexed owner,
        bytes32 indexed tldHash,
        bytes32 indexed subdomainHash,
        string tld,
        string subdomain,
        uint256 expires,
        uint256 cost
    );

    event SubdomainBidFailed(
        address indexed owner,
        bytes32 indexed tldHash,
        bytes32 indexed subdomainHash,
        string tld,
        string subdomain,
        uint256 expires,
        uint256 refund
    );

    function expiry(bytes32 subdomain) external view returns (uint256);

    function commit(bytes32 subdomain, bytes32 secret) external payable returns (bytes32);

    function revealRegister(string calldata subdomainPlainText, bytes32 secret, uint256 value) external returns (bool);

    function hasSubdomainExpired(bytes32 subdomain) external view returns (bool);

    function makeSubdomainCommitment(bytes32 subdomain, bytes32 secret, uint256 value) external view returns (bytes32);

    function hasDomainCommitment(bytes32 subdomain, bytes32 secret, uint256 value) external view returns (bool);

//    function cname(bytes32 domain) external view returns (address);
}
