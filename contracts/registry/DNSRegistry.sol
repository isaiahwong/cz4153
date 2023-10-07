// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IDNS.sol";
import "hardhat/console.sol";

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

    function makeSubdomain(bytes32 parentDomain, bytes32 domain) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(parentDomain, domain));
    }

    function setSubDomain(
        bytes32 parentDomain,
        string memory domain,
        address owner
    ) public auth(parentDomain) override returns (bytes32) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        bytes32 subdomain = makeSubdomain(parentDomain, domainHash);
        registrars[subdomain].owner = owner;
        emit NewDomainOwner(parentDomain, domainHash, domain, owner);
        return subdomain;
    }

    function setResolver(bytes32 domain, address _resolver) public auth(domain) {
        registrars[domain].resolver = _resolver;
    }

    function resolver(bytes32 domain) public view returns (address) {
        return registrars[domain].resolver;
    }

    function addr(bytes32 domain) public view override returns (address) {
        return registrars[domain].owner;
    }

    function available(bytes32 domain) public view returns (bool) {
        return registrars[domain].owner == address(0x0);
    }

    function bulkResolve(bytes32[] memory domains) public view returns (address[] memory) {
        address[] memory addresses = new address[](domains.length);
        for (uint256 i = 0; i < domains.length; i++) {
            addresses[i] = addr(domains[i]);
        }
        return addresses;
    }
}
