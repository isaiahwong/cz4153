// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DNSRegistry {
    struct Registrar {
        address owner;
        address resolver;
    }

    // Stores a mapping of domains to registrar owners
    mapping(bytes32 => Registrar) registrars;

    modifier isAuth(bytes32 domain) {
        require(registrars[domain].owner == msg.sender);
        _;
    }

    constructor() {
        // Sets the owner of the root domain
        registrars[0x0].owner = msg.sender;
    }

    function setSubDomain(bytes32 parentDomain, bytes32 domain, address owner) public isAuth(domain) {
//        registrars[domain].resolver = resolver;
    }
}
