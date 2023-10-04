// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Registrar is ERC721, Ownable {

    // A map of expiry times
    mapping(uint256 => uint256) expiries;

    bytes32 public tld;

    constructor(
        string memory name,
        string memory symbol,
        string memory _tld) ERC721(name, symbol) {
        tld = keccak256(abi.encodePacked(_tld));
    }
}
