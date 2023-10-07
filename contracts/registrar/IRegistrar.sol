// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRegistrar {
    event SubdomainRegistered(
        address indexed owner,
        string domain,
        string subdomain,
        uint256 expires,
        uint256 cost
    );

    function commit(bytes32 subdomain, bytes32 secret) external payable returns (bytes32);

    function revealRegister(string calldata subdomainPlainText, bytes32 secret, uint256 value) external returns (bool);

//    function cname(bytes32 domain) external view returns (address);
}
