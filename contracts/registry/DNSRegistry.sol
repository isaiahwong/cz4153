// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IDNS.sol";
import "hardhat/console.sol";

/**
 * @dev Implementation of the {IDNS} interface. This contract is used to store a mapping of domains to owners.
 * DNSRegistry is the root domain, and all domains are stored as subdomains of the root domain.
 */
contract DNSRegistry is IDNS, Initializable {
    struct Record {
        address owner;
    }

    // Stores a mapping of domains to registrar owners
    mapping(bytes32 => Record) registrars;

    // Stores a mapping of registrar owners to canonical names
    mapping(address => string) public cnames;

    /**
     * @dev Modifier that checks if the caller is the owner of the domain.
     */
    modifier auth(bytes32 domain) {
        require(registrars[domain].owner == msg.sender, "not authorized");
        _;
    }

    /**
     * @dev Initializes the contract by setting the contract publisher as the owner of root domain.
     */
    function initialize(address owner) public initializer {
        // Sets the owner of the root domain
        registrars[0x0].owner = owner;
    }

    /**
     * @dev Creates a domain hash from a parent domain hash and a domain hash. Both hashes are encoded with keccak256.
     */
    function makeDomain(bytes32 parentDomain, bytes32 domain) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(parentDomain, domain));
    }

    /**
     * @dev Sets the owner of a subdomain.
     * @param parentDomain The parent domain of the subdomain.
     * @param domain The subdomain to set the owner of.
     * @param owner The owner of the domain.
     */
    function setSubDomain(
        bytes32 parentDomain,
        string memory domain,
        address owner
    ) public auth(parentDomain) override returns (bytes32) {
        bytes32 domainHash = keccak256(abi.encodePacked(domain));
        bytes32 fqdn = makeDomain(parentDomain, domainHash);
        registrars[fqdn].owner = owner;

        emit NewDomainOwner(parentDomain, domainHash, domain, owner);
        return fqdn;
    }

    /**
     * @dev Sets the canonical name of a domain.
     * @param parentDomain The parent domain of the subdomain.
     * @param domain The subdomain to set the owner of.
     * @param owner The owner of the domain.
     */
    function setCName(bytes32 parentDomain, string memory domain, address owner) public auth(parentDomain) {
        cnames[owner] = domain;
    }

    /**
     * @dev Returns the canonical name of a domain.
     * @param owner The owner of the domain.
     */
    function cname(address owner) public view returns (string memory) {
        return cnames[owner];
    }

    /**
     * @dev Returns the owner of a domain.
     * @param domain The domain hash encoded with keccak256.
     */
    function addr(bytes32 domain) public view override returns (address) {
        return registrars[domain].owner;
    }

    /**
     * @dev Returns true if the domain is available. Does not check if domain
     * has expired. Refer to respective registrars for expiry checks.
     * @param domain The domain hash encoded with keccak256.
     */
    function available(bytes32 domain) public view returns (bool) {
        return registrars[domain].owner == address(0x0);
    }

    /**
     * @dev Returns the owner of a list of domains
     * @param domains The domains of owners.
     */
    function bulkResolve(bytes32[] memory domains) public view returns (address[] memory) {
        address[] memory addresses = new address[](domains.length);
        for (uint256 i = 0; i < domains.length; i++) {
            addresses[i] = addr(domains[i]);
        }
        return addresses;
    }
}
