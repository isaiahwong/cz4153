import {ethers} from "hardhat";
import { expect } from "chai";
import crypto from "crypto";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {AuctionMock} from "../../frontend/src/api/typechain-types";
import {moveTime} from "../util/time";
import {expectFailure} from "../util/exception";
import {randomSecret} from "../../scripts/setup";

const AUCTION_DURATION = 3 * 60; // 3 minutes
let auction: AuctionMock;
let auctionOwner: SignerWithAddress;
let buyer1: SignerWithAddress;
let buyer2: SignerWithAddress;

before(async () => {
    const accounts = await ethers.getSigners();
    auctionOwner = accounts[0];
    buyer1 = accounts[2];
    buyer2 = accounts[3];

    // Deploy auction
    const auctionFactory = await ethers.getContractFactory("AuctionMock");
    auction = await auctionFactory.connect(auctionOwner).deploy(AUCTION_DURATION);
});

describe("TestAuction", () => {

    it("should deny 0 eth", async ()=> {
        const label1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const secret1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const value1 = ethers.parseEther("0");

        const commitment1 = await auction.makeCommitment(buyer1.address, label1, secret1, value1);

        await expectFailure(
            auction.connect(buyer1).commit(label1, commitment1, {value: value1})
        );
    });

    it("should deny change in commitment", async ()=> {
        const label1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const labelChanged = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const secret1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const secretChanged = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const value1 = ethers.parseEther("0.01");
        const commitment1 = await auction.makeCommitment(buyer1.address, label1, secret1, value1);

        await (await auction.connect(buyer1).commit(label1, commitment1, {value: value1})).wait();

        await expectFailure(
            auction.connect(buyer1).reveal(labelChanged, secret1, value1)
        );
        await expectFailure(
            auction.connect(buyer1).reveal(label1, secretChanged, value1)
        );
        await expectFailure(
            auction.connect(buyer1).reveal(label1, secret1, ethers.parseEther("0.00"))
        );
    });

    it("should commit and reveal highest", async () => {
        const auctionInitialBalance = await ethers.provider.getBalance(auction.target);

        // Buyer 1 commits
        const label1 = ethers.keccak256(ethers.toUtf8Bytes("hello world1"));
        const secret1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const value1 = ethers.parseEther("0.01");
        const commitment1 = await auction.makeCommitment(buyer1.address, label1, secret1, value1);

        await (await auction.connect(buyer1).commit(label1, commitment1, {value: value1})).wait();

        // Buyer 2 commits
        const label2 = ethers.keccak256(ethers.toUtf8Bytes("hello world1"));
        const secret2 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const value2 = ethers.parseEther("0.02");
        const commitment2 = await auction.makeCommitment(buyer2.address, label2, secret2, value2);

        await (await auction.connect(buyer2).commit(label2, commitment2, {value: value2})).wait();

        // Ensure registrar has the correct balance
        expect(await ethers.provider.getBalance(auction.target)).to.equal(auctionInitialBalance + value1 + value2);

        // Advance time
        const block = await ethers.provider.getBlock("latest");
        await ethers.provider.send("evm_mine", [block!.timestamp + AUCTION_DURATION + 1]);

        await moveTime(AUCTION_DURATION + 1);

        // Reveal
        await auction.connect(buyer1).reveal(label1, secret1, value1);
        await auction.connect(buyer2).reveal(label2, secret2, value2);

        expect(await auction.auctionHighestBidder(label1)).equal(buyer2.address);

        // Expect auction to have only the highest bid amount
        expect(await ethers.provider.getBalance(auction.target)).to.equal(auctionInitialBalance + value2);
    });

    it("should commit and reveal FIFO with equal value", async () => {
        const auctionInitialBalance = await ethers.provider.getBalance(auction.target);

        // Buyer 1
        const label1 = ethers.keccak256(ethers.toUtf8Bytes("hello world2"));
        const secret1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const value1 = ethers.parseEther("0.01");

        const commitment1 = await auction.makeCommitment(buyer1.address, label1, secret1, value1);

        await (await auction.connect(buyer1).commit(label1, commitment1, {value: value1})).wait();

        // Buyer 2
        const label2 = ethers.keccak256(ethers.toUtf8Bytes("hello world2"));
        const secret2 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
        const value2 = ethers.parseEther("0.01");

        const commitment2 = await auction.makeCommitment(buyer2.address, label2, secret2, value2);

        await (await auction.connect(buyer2).commit(label2, commitment2, {value: value2})).wait();

        // Ensure registrar has the correct balance
        expect(await ethers.provider.getBalance(auction.target)).to.equal(auctionInitialBalance + value1 + value2);

        // Advance time
        const block = await ethers.provider.getBlock("latest");
        await ethers.provider.send("evm_mine", [block!.timestamp + AUCTION_DURATION + 1]);

        await moveTime(AUCTION_DURATION + 1);

        // Reveal
        await auction.connect(buyer1).reveal(label1, secret1, value1);
        await auction.connect(buyer2).reveal(label2, secret2, value2);

        expect(await auction.auctionHighestBidder(label1)).equal(buyer1.address);

        // Expect auction to have only the highest bid amount
        expect(await ethers.provider.getBalance(auction.target)).to.equal(auctionInitialBalance + value1);
    });
});
