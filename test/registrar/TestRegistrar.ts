import {ethers} from "hardhat";
import {expect} from "chai";
import crypto from "crypto";
import namehash from "eth-ens-namehash";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {DNSRegistry, Registrar} from "../../typechain-types";
import {moveTime} from "../util/time";

const AUCTION_DURATION = 3 * 60; // 3 minutes
const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'
let registrar: Registrar;
let registrarOwner: SignerWithAddress;

let dns: DNSRegistry;
let dnsOwner: SignerWithAddress;

let buyer1: SignerWithAddress;
let buyer2: SignerWithAddress;

function randomSecret() {
    return (
        '0x' + crypto.randomBytes(24).toString('hex')
    )
}

before(async () => {
    const accounts = await ethers.getSigners();
    dnsOwner = accounts[0];
    registrarOwner = accounts[1];
    buyer1 = accounts[2];
    buyer2 = accounts[3];

    // Deploy DNS
    const dnsFactory = await ethers.getContractFactory("DNSRegistry");
    dns = await dnsFactory.connect(dnsOwner).deploy();


    // Deploy Registrar
    const tld = "ntu";
    const tldhash = namehash.hash(tld)

    const registrarFactory = await ethers.getContractFactory("Registrar");
    registrar = await registrarFactory.connect(registrarOwner).deploy("ntu_registrar", "ntu.dns", tldhash, AUCTION_DURATION, dns.target);

    // Set registrar as owner of ntu
    await dns.setSubDomain(
        EMPTY_BYTES32,
        ethers.keccak256(ethers.toUtf8Bytes(tld)),
        registrar.target,
    );
});

it("should allow commit and reveal", async () => {
    const subdomain = ethers.keccak256(ethers.toUtf8Bytes("student"));
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
        registrar.connect(bid.bidder).commit(subdomain, bid.secret, {value: bid.value}),
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
    expect(await dns.domainOwner(namehash.hash("student.ntu"))).to.equal(buyer1.address);
});