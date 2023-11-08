// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface that defines the methods of a DNS Registry.
 */
interface IDNS {

    /**
     * @dev Emitted when a new domain is assigned.
     */
    event NewDomainOwner(
        bytes32 indexed parentDomain,
        bytes32 domain,
        string domainPlainText,
        address owner
    );

    /**
     * @dev Sets the owner of a subdomain.
     * @param parentDomain The parent domain hash encoded with keccak256.
     * @param domain The subdomain to set the owner of.
     * @param owner The owner of the domain.
     */
    function setSubDomain(
        bytes32 parentDomain,
        string memory domain,
        address owner
    ) external returns (bytes32);

    /**
     * @dev Creates a domain hash from a parent domain hash and a domain hash. Both hashes are encoded with keccak256.
     */
    function makeDomain(bytes32 parentDomain, bytes32 domain) external pure returns (bytes32);

    /**
     * @dev Sets the canonical name of a domain.
     * @param parentDomain The parent domain hash encoded with keccak256.
     * @param domain The subdomain to set the owner of.
     * @param owner The owner of the domain.
     */
    function setCName(bytes32 parentDomain, string memory domain, address owner) external;

    /**
     * @dev Returns the owner of a domain.
     * @param domain The domain hash encoded with keccak256.
     */
    function addr(bytes32 domain) external view returns (address);

    /**
     * @dev Returns the canonical name of a domain.
     * @param owner The owner of the domain.
     */
    function cname(address owner) external view returns (string memory);

    /**
     * @dev Returns true if the domain is available. Does not check if domain
     * has expired. Refer to respective registrars for expiry checks.
     * @param domain The domain hash encoded with keccak256.
     */
    function available(bytes32 domain) external view returns (bool);
}