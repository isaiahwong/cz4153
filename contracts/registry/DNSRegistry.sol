// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IDNS.sol";

contract DNSRegistry is IDNS {
    struct Registrar {
        address owner;
        address resolver;
    }

    // Stores a mapping of domains to registrar owners
    mapping(bytes32 => Registrar) registrars;

    modifier auth(bytes32 domain) {
        require(registrars[domain].owner == msg.sender);
        _;
    }

    constructor() {
        // Sets the owner of the root domain
        registrars[0x0].owner = msg.sender;
    }

    function setSubDomain(
        bytes32 parentDomain,
        bytes32 domain,
        address owner
    ) public auth(parentDomain) override returns (bytes32) {
        bytes32 subdomain = keccak256(abi.encodePacked(parentDomain, domain));
        registrars[subdomain].owner = owner;
        emit NewDomainOwner(parentDomain, domain, owner);
        return subdomain;
    }

    function resolver(bytes32 domain) public view returns (address) {
        return registrars[domain].resolver;
    }

    function exists(bytes32 domain) public view returns (bool) {
        return registrars[domain].owner != address(0x0);
    }
}