// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDNS {
    event NewDomainOwner(
        bytes32 indexed parentDomain,
        bytes32 domain,
        string domainPlainText,
        address owner
    );

    function setSubDomain(
        bytes32 parentDomain,
        string memory domain,
        address owner
    ) external returns (bytes32);

    function addr(bytes32 domain) external view returns (address);
}
