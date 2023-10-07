import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {DNSRegistry, IRegistrar, IRegistrar__factory, Registrar} from "../../frontend/src/api/typechain-types";
import {moveTime} from "../util/time";
import {expectFailure} from "../util/exception";
import {deployDNS, deployRegistrar, randomSecret} from "../../scripts/setup";

const AUCTION_DURATION = 3 * 60; // 3 minutes

let registrar: IRegistrar;
let registrarOwner: SignerWithAddress;

let dns: DNSRegistry;
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
    buyer3 = accounts[3];

    // Deploy DNS
    dns = await deployDNS(dnsOwner);

    // Deploy Registrar
    const tld = "ntu";
    registrar = await deployRegistrar(registrarOwner, dns, tld, AUCTION_DURATION);
});

it("should allow commit and reveal", async () => {
    const subdomain = "student";
    const subdomainHash = ethers.keccak256(ethers.toUtf8Bytes(subdomain));
    const initialBalance = await ethers.provider.getBalance(registrar.target);

    const bids = {
        "buyer1": {
            bidder: buyer1,
            secret: ethers.keccak256(ethers.toUtf8Bytes(randomSecret())),
            value: ethers.parseEther("0.01"),
        },
        "buyer2": {
            bidder: buyer2,
            secret: ethers.keccak256(ethers.toUtf8Bytes(randomSecret())),
            value: ethers.parseEther("0.01"),
        }
    }

    const commits = Object.values(bids).map(bid =>
        registrar.connect(bid.bidder).commit(subdomainHash, bid.secret, {value: bid.value}),
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
        registrar.connect(bid.bidder).revealRegister(subdomain, bid.secret, bid.value),
    );
    await Promise.all(reveals);

    // Ensure buyer1 is the owner of student.ntu
    expect(await dns.addr(ethers.namehash("student.ntu"))).to.equal(buyer1.address);
});

it("should fail to register owned domains", async () => {
    const subdomain = ethers.keccak256(ethers.toUtf8Bytes("student"));
    const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
    const value = ethers.parseEther("0.01");

    await expectFailure(
        registrar.connect(buyer2).commit(subdomain, secret, {value: value})
    );
});

it("should register multiple domains and list all domains owned", async () => {
    const bids = [
        {
            subdomain: "scse",
            subdomainHash: ethers.keccak256(ethers.toUtf8Bytes("scse")),
            secret: ethers.keccak256(ethers.toUtf8Bytes(randomSecret())),
            value: ethers.parseEther("0.01"),
        },
        {
            subdomain: "nbs",
            subdomainHash: ethers.keccak256(ethers.toUtf8Bytes("nbs")),
            secret: ethers.keccak256(ethers.toUtf8Bytes(randomSecret())),
            value: ethers.parseEther("0.01"),
        },
    ];


    // Execute commits
    const commits = Object.values(bids).map(bid =>
        registrar.connect(buyer3).commit(bid.subdomainHash, bid.secret, {value: bid.value}),
    );
    await Promise.all(commits);

    // Advance time
    await moveTime(AUCTION_DURATION + 1);

    // Reveal
    const reveals = Object.values(bids).map(bid =>
        registrar.connect(buyer3).revealRegister(bid.subdomain, bid.secret, bid.value),
    );
    await Promise.all(reveals);

    const registerFilter = registrar.filters.SubdomainRegistered(buyer3)
    const events = await registrar.queryFilter(registerFilter);

    // Filter out expired domains
    const domains = events
        .map(event => event.args)
        .filter(args => args !== undefined && args![3] > Date.now() / 1000)
        .map(args => args!);

    expect(domains.length).equal(2);

    // Ensure domains are listed in events
    bids.forEach((bid, i) => {
        expect(domains[i][2]).equal(bid.subdomain);
    });
});