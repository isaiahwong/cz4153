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

    function makeDomain(bytes32 parentDomain, bytes32 domain) external pure returns (bytes32);

    function setCName(bytes32 parentDomain, string memory domain, address owner) external;

    function addr(bytes32 domain) external view returns (address);

    function cname(address owner) external view returns (string memory);

    function available(bytes32 domain) external view returns (bool);
}