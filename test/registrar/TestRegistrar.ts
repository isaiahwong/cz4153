import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {DNSRegistry, Registrar} from "../../frontend/src/api/typechain-types";
import {moveTime} from "../util/time";
import {expectFailure} from "../util/exception";
import {deployDNS, deployRegistrar, randomSecret} from "../../scripts/setup";

const AUCTION_DURATION = 3 * 60; // 3 minutes
const GRACE_PERIOD = (90 * 24 * 60 * 60)
const TENURE = (365 * 24 * 60 * 60);

let registrar: Registrar;
let registrarOwner: SignerWithAddress;

let dnsRegistry: DNSRegistry;
let dnsOwner: SignerWithAddress;

let buyer1: SignerWithAddress;
let buyer2: SignerWithAddress;
let buyer3: SignerWithAddress;

before(async () => {
    const accounts = await ethers.getSigners();
    dnsOwner = accounts[0];
    registrarOwner = accounts[1];
    buyer1 = accounts[2];
    buyer2 = accounts[3];
    buyer3 = accounts[4];

    // Deploy DNS
    dnsRegistry = await deployDNS(dnsOwner);

    // Deploy Registrar
    const tld = "ntu";
    registrar = await deployRegistrar(registrarOwner, dnsRegistry, tld, AUCTION_DURATION);
});

it("☕️ getter and setter unit tests", async () => {
    const duration = 30;
    await registrar.connect(registrarOwner).setDuration(duration);
    expect(await registrar.getAuctionDuration()).to.equal(duration);

    // Ensure deadline correct
    const domain = "helloworld";
    const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
    const value = ethers.parseEther("0.01");
    await registrar.connect(buyer2).commit(domain, secret, {value: value})
    const block = await ethers.provider.getBlock("latest");

    const deadline = await registrar.connect(buyer2).auctionDeadline(ethers.keccak256(ethers.toUtf8Bytes(domain)));
    expect(deadline).equal(block!.timestamp + duration);
});

it("👻 should be in effect on first auction commit", async () => {
    const domain = "helloworld";
    const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
    const value = ethers.parseEther("0.01");
    const block = await ethers.provider.getBlock("latest");
    const auctionDuration = await registrar.getAuctionDuration();

    await registrar.connect(buyer2).commit(domain, secret, {value: value})
    const expiry = await registrar.expiry(ethers.keccak256(ethers.toUtf8Bytes(domain)));

    expect(expiry).equal(block!.timestamp + TENURE + Number(auctionDuration));
});

it("👻 should allow commit and reveal", async () => {
    const domain = "student";
    const initialBalance = await ethers.provider.getBalance(registrar.target);

    const bids = {
        "buyer1": {
            bidder: buyer1,
            secret: randomSecret(),
            value: ethers.parseEther("0.01"),
        },
        "buyer2": {
            bidder: buyer2,
            secret: randomSecret(),
            value: ethers.parseEther("0.01"),
        }
    }

    const commits = Object.values(bids).map(async (bid) =>
        registrar.connect(bid.bidder).commit(domain, ethers.keccak256(ethers.toUtf8Bytes(bid.secret)), {value: bid.value})
    );
    await Promise.all(commits);

    const registrarBalance = Object.values(bids).reduce((acc, bid) =>
            acc + bid.value
        , initialBalance,
    );

    // Ensure registrar has the correct balance
    expect(await ethers.provider.getBalance(registrar.target)).to.equal(registrarBalance);

    // Advance time
    await moveTime(AUCTION_DURATION + 1);

    // Reveal
    const reveals = Object.values(bids).map(bid =>
        registrar.connect(bid.bidder).revealRegister(domain, bid.secret, bid.value),
    );
    await Promise.all(reveals);

    // Ensure buyer1 is the owner of student.ntu
    expect(await dnsRegistry.addr(ethers.namehash("student.ntu"))).to.equal(buyer1.address);
});

it("😢 should fail to register owned domains", async () => {
    const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
    const value = ethers.parseEther("0.01");

    await expectFailure(
        registrar.connect(buyer2).commit("student", secret, {value: value})
    );
});

it("🏠 should register multiple domains and list all domains owned", async () => {
    const bids = [
        {
            domain: "scse",
            domainHash: ethers.keccak256(ethers.toUtf8Bytes("scse")),
            secret: randomSecret(),
            value: ethers.parseEther("0.01"),
        },
        {
            domain: "nbs",
            domainHash: ethers.keccak256(ethers.toUtf8Bytes("nbs")),
            secret: randomSecret(),
            value: ethers.parseEther("0.01"),
        },
    ];

    // Execute commits
    const commits = Object.values(bids).map(bid =>
        registrar.connect(buyer3).commit(bid.domain, ethers.keccak256(ethers.toUtf8Bytes(bid.secret)), {value: bid.value}),
    );

    await Promise.all(commits);

    // Advance time
    await moveTime(AUCTION_DURATION + 1);

    // Reveal
    const reveals = Object.values(bids).map(bid =>
        ({domain: bid.domain, secret: bid.secret, value: bid.value})
    );
    await registrar.connect(buyer3).batchRevealRegister(reveals);

    const registerFilter = registrar.filters.DomainRegistered(buyer3)
    const events = await registrar.queryFilter(registerFilter);

    // Filter out expired domains
    const domains = events
        .map(event => event.args)
        .filter(args => args !== undefined && args.expires > Date.now() / 1000)
        .map(args => args!);

    expect(domains.length).equal(2);

    // Ensure domains are listed in events
    bids.forEach((bid, i) => {
        expect(domains[i].domain).equal(bid.domain);
    });
});

it("👨🏻‍💻 should allow setting of cname", async () => {
    await registrar.connect(buyer3).setCName("scse");
    expect(await dnsRegistry.cname(buyer3.address)).equal("scse.ntu");
});

it("👮🏻‍ should not allow setting of cname of not owner", async () => {
    await expectFailure(
        registrar.connect(buyer2).setCName("scse")
    );
});

it ("👨🏻‍💻 should allow rebidding after expiry", async () => {
    const domain = "newdomain";
    const secret1 = randomSecret() ;
    const value = ethers.parseEther("0.01");
    await registrar.connect(buyer1).commit(domain, ethers.keccak256(ethers.toUtf8Bytes(secret1)), {value: value})

    await moveTime(AUCTION_DURATION + 1);

    await registrar.connect(buyer1).revealRegister(domain, secret1, value);
    const owner1 = await dnsRegistry.connect(buyer1).addr(ethers.namehash(`${domain}.ntu`));
    expect(owner1).equal(buyer1.address);

    // Move to
    await moveTime(AUCTION_DURATION + GRACE_PERIOD + TENURE);

    const hasDomainExpired = await registrar.hasDomainExpired(ethers.keccak256(ethers.toUtf8Bytes(domain)));
    expect(hasDomainExpired).equal(true);

    // Rebid
    const secret2 = randomSecret() ;
    await registrar.connect(buyer2).commit(domain, ethers.keccak256(ethers.toUtf8Bytes(secret2)), {value: value})
    await moveTime(AUCTION_DURATION + 1);

    // Reveal
    await registrar.connect(buyer2).revealRegister(domain, secret2, value);
    const owner2 = await dnsRegistry.connect(buyer1).addr(ethers.namehash(`${domain}.ntu`));
    expect(owner2).equal(buyer2.address);
});