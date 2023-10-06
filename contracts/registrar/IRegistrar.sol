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

//    function cname(bytes32 domain) external view returns (address);
}
