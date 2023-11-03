// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library Errors {
    error NotOwner();
    error InvalidGovernance();
    error InsufficientBalance();
    error InsufficientBid();
    error AuctionExpired();
    error AuctionNotExpired();
    error AuctionDoesNotExist();

    error BidTooLow();
    error BidExists();

    error CommitmentDoesNotExist();

    error DomainNotExpired();
}
