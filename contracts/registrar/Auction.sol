// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Errors.sol";

abstract contract Auction {
    struct Record {
        address maxBidder;
        uint256 maxBid;
        uint256 end;
    }

    mapping(address => mapping(bytes32 => uint256)) bids;

    uint256 private auctionDuration;

    mapping(bytes32 => Record) auctions;

    constructor(uint256 _duration) {
        _setDuration(_duration);
    }

    function auctionExists(bytes32 label) public view returns (bool) {
        return auctions[label].maxBidder != address(0x0);
    }

    function hasAuctionExpired(bytes32 label) public view returns (bool) {
        return auctions[label].end < block.timestamp;
    }

    function auctionDeadline(bytes32 label) public view returns (uint256) {
        return auctions[label].end;
    }

    function auctionHighestBid(bytes32 label) public view returns (uint256) {
        return auctions[label].maxBid;
    }

    function auctionHighestBidder(bytes32 label) public view returns (address) {
        if (!auctionExists(label)) {
            revert Errors.AuctionDoesNotExist();
        }
        if (!hasAuctionExpired(label)) {
            revert Errors.AuctionNotExpired();
        }
        return auctions[label].maxBidder;
    }

    function makeCommitment(address owner, bytes32 name, bytes32 secret, uint256 value) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(owner, name, secret, value));
    }

    function getAuctionDuration() public view returns (uint256) {
        return auctionDuration;
    }

    function commitmentExists(address sender, bytes32 commitment) public view returns (bool) {
        return bids[sender][commitment] != 0;
    }

    function _setDuration(uint256 _duration) internal {
        auctionDuration = _duration;
    }

    function _createAuction(bytes32 label) internal {
        auctions[label].maxBid = 0;
        auctions[label].maxBidder = address(0x0);
        auctions[label].end = block.timestamp + auctionDuration;
    }

    function commitBid(bytes32 label, bytes32 commitment) internal {
        // Check if bid exists
        if (commitmentExists(msg.sender, commitment)) {
            revert Errors.BidExists();
        }

        // Check if auction exists
        if (!auctionExists(label)) {
            _createAuction(label);
        }

        if (hasAuctionExpired(label)) {
            revert Errors.AuctionExpired();
        }

        if (msg.value <= 0) {
            revert Errors.BidTooLow();
        }

        bids[msg.sender][commitment] = msg.value;

        // Check for strictly greater bid
        if (msg.value > auctions[label].maxBid) {
            auctions[label].maxBidder = msg.sender;
            auctions[label].maxBid = msg.value;
        }
    }

    function revealAuction(bytes32 label, bytes32 secret, uint256 value) internal returns (bool) {
        bytes32 commitment = makeCommitment(msg.sender, label, secret, value);

        // Check if auction exists
        if (!auctionExists(label)) {
            revert Errors.AuctionDoesNotExist();
        }

        // Check if auction expired
        if (!hasAuctionExpired(label)) {
            revert Errors.AuctionNotExpired();
        }

        // Check if commitment exists
        if (!commitmentExists(msg.sender, commitment)) {
            revert Errors.CommitmentDoesNotExist();
        }

        // Refund if not max bidder
        if (auctions[label].maxBidder != msg.sender) {
            (bool success,) = msg.sender.call{value: bids[msg.sender][commitment]}("");
            require(success, "Refund failed");
        }

        // Delete commitment
        delete bids[msg.sender][commitment];

        return auctions[label].maxBidder == msg.sender;
    }
}