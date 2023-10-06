// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDNS {
    event NewDomainOwner(bytes32 indexed parentDomain, bytes32 indexed domain, address owner);

    function setSubDomain(
        bytes32 parentDomain,
        bytes32 domain,
        address owner
    ) external returns (bytes32);
}