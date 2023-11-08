// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAuction {
    function hasAuctionExpired(bytes32 label) external view returns (bool);

    function hasCommitment(bytes32 commitment) external view returns (bool);

    function auctionDeadline(bytes32 label) external view returns (uint256);

    function auctionHighestBid(bytes32 label) external view returns (uint256);

    function auctionHighestBidder(bytes32 label) external view  returns (address);

    function getAuctionDuration() external view returns (uint256);
}
