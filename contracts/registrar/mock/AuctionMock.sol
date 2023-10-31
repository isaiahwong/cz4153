// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../Auction.sol";

/**
 * @dev Implementation of the {IAuction} interface. The AuctionMock is used as a
 * concrete mock contract to test the Auction contract.
 */
contract AuctionMock is Auction {
    constructor(uint256 duration) Auction(duration) {}

    function commit(bytes32 label, bytes32 commitment) public payable {
        commitBid(label, commitment);
    }

    function reveal(bytes32 label, bytes32 secret, uint256 value) public returns (bool, uint256, bytes32) {
        return revealAuction(
            label,
            secret,
            value
        );
    }
}
