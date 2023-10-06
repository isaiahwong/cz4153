// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../Auction.sol";

contract AuctionMock is Auction {
    constructor(uint256 duration) Auction(duration) {

    }

    function commit(bytes32 label, bytes32 commitment) public payable {
        commitBid(label, commitment);
    }

    function reveal(bytes32 label, bytes32 secret, uint256 value) public returns (bool) {
        return revealAuction(
            label,
            secret,
            value
        );
    }
}
