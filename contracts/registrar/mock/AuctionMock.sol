// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../Auction.sol";

/**
 * @dev Implementation of the {IAuction} interface. The AuctionMock is used as a
 * concrete mock contract to test the Auction contract.
 */
contract AuctionMock is Auction {
    function initialize(uint256 duration) public initializer {
        __Auction_init(duration);
    }

    function commit(bytes32 label, bytes32 commitment) public payable {
        commitBid(label, commitment, msg.value);
    }

    function reveal(bytes32 label, bytes32 secret, uint256 value) public returns (Result memory) {
        return revealAuction(
            label,
            secret,
            value
        );
    }
}
