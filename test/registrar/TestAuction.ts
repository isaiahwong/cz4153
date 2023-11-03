import {ethers} from "hardhat";
import {expect} from "chai";
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

describe("👮🏻 Test Auction Contract", () => {

    describe("💸 commit", () => {
        it("should deny 0 eth", async () => {
            const label1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secret1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const value1 = ethers.parseEther("0");

            const commitment1 = await auction.makeCommitment(buyer1.address, label1, secret1, value1);

            await expectFailure(
                auction.connect(buyer1).commit(label1, commitment1, {value: value1})
            );
        });


        it("should deny duplicate commitments", async () => {
            const label = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const value = ethers.parseEther("1");

            const commitment = await auction.makeCommitment(buyer1.address, label, secret, value);

            await auction.connect(buyer1).commit(label, commitment, {value: value})

            await expectFailure(
                auction.connect(buyer1).commit(label, commitment, {value: value})
            );
        });
    });


    describe(" reveal", () => {
        it("should throw error for revealing highest bid for non-existent auction", async () => {
            const label = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));

            await expectFailure(
                auction.connect(buyer1).auctionHighestBid(label)
            );
        });

        it("should prevent revealing highest bid before reveal", async () => {
            const label = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const value = ethers.parseEther("1");

            const commitment = await auction.makeCommitment(buyer1.address, label, secret, value);

            await auction.connect(buyer1).commit(label, commitment, {value: value})

            await expectFailure(
                auction.connect(buyer1).auctionHighestBid(label)
            );
        });

        it("should deny change in commitment in reveal", async () => {
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

        it("should throw error for revealing invalid commitment", async () => {
            const label = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const value = ethers.parseEther("1");

            const commitment = await auction.makeCommitment(buyer1.address, label, secret, value);

            await auction.connect(buyer1).commit(label, commitment, {value: value})

            // Advance time
            await moveTime(AUCTION_DURATION + 1);

            await expectFailure(
                auction.connect(buyer2).reveal(label, secret, value)
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
            const buyer2BeforeRefundBalance = await ethers.provider.getBalance(buyer2.address);

            // Reveal
            await auction.connect(buyer1).reveal(label1, secret1, value1);
            await auction.connect(buyer2).reveal(label2, secret2, value2);
            const buyer2AfterRefundBalance = await ethers.provider.getBalance(buyer2.address);

            expect(await auction.auctionHighestBidder(label1)).equal(buyer1.address);

            // Expect auction to have only the highest bid amount
            expect(await ethers.provider.getBalance(auction.target)).to.equal(auctionInitialBalance + value1);

            // After refund, buyer2 should have more eth than before excluding gas
            expect(buyer2AfterRefundBalance).gte(buyer2BeforeRefundBalance);
        });
    });

    describe("post commit-reveal", () => {
        it("should deny commitments for auction that ended", async () => {
            const label = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secret1 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secret2 = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const value = ethers.parseEther("1");

            const commitment1 = await auction.makeCommitment(buyer1.address, label, secret1, value);

            await auction.connect(buyer1).commit(label, commitment1, {value: value})

            await moveTime(AUCTION_DURATION + 1);

            const commitment2 = await auction.makeCommitment(buyer2.address, label, secret2, value);

            await expectFailure(
                auction.connect(buyer2).commit(label, commitment2, {value: value})
            );
        });

    });
});
