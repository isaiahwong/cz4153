import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {DNSRegistry, Registrar} from "../../frontend/src/api/typechain-types";
import {deployDNS, deployRegistrar, randomSecret} from "../../scripts/setup";
import {moveTime} from "../util/time";
const AUCTION_DURATION = 3 * 60; // 3 minutes

let registrar: Registrar;
let registrarOwner: SignerWithAddress;

let dnsRegistry: DNSRegistry;
let dnsOwner: SignerWithAddress;

let buyer1: SignerWithAddress;
before(async () => {
    const accounts = await ethers.getSigners();
    dnsOwner = accounts[0];
    registrarOwner = accounts[1];
    buyer1 = accounts[2];

    // Deploy DNS
    dnsRegistry = await deployDNS(dnsOwner);

    // Deploy Registrar
    const tld = "ntu";
    registrar = await deployRegistrar(registrarOwner, dnsRegistry, tld, AUCTION_DURATION);

    // Register domains
    const spmsBid = [
        {
            domain: "spms",
            domainHash: ethers.keccak256(ethers.toUtf8Bytes("spms")),
            secret: randomSecret(),
            value: ethers.parseEther("0.01"),
        },
    ];

    const nbsBid = [
        {
            domain: "nbs",
            domainHash: ethers.keccak256(ethers.toUtf8Bytes("nbs")),
            secret: randomSecret(),
            value: ethers.parseEther("0.01"),
        },
    ];

    const spmsPrecommits = Object.values(spmsBid).map(async (bid) => {
        const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(bid.domain)))
        const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))]);
        await registrar.connect(buyer1).precommit(commitment, {value: bid.value});
    });
    const nbsPrecommits = Object.values(nbsBid).map(async (bid) => {
        const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(bid.domain)))
        const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))]);
        await registrar.connect(buyer1).precommit(commitment, {value: bid.value});
    });

    await Promise.all([...spmsPrecommits, ...nbsPrecommits]);

    // Execute commits
    const spmsCommits = Object.values(spmsBid).map(bid =>
        registrar.connect(buyer1).commit(bid.domain, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))),
    );

    const nbsCommits = Object.values(nbsBid).map(bid =>
        registrar.connect(buyer1).commit(bid.domain, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))),
    );
    await Promise.all([...spmsCommits, ...nbsCommits]);

    // Advance time
    await moveTime(AUCTION_DURATION + 1);

    // Reveal
    const spmsReveals = Object.values(spmsBid).map(bid =>
        ({domain: bid.domain, secret: bid.secret, value: bid.value})
    );
    const nbsReveals = Object.values(nbsBid).map(bid =>
        ({domain: bid.domain, secret: bid.secret, value: bid.value})
    );

    await registrar.connect(buyer1).batchRevealRegister(spmsBid[0].domain, spmsReveals);
    await registrar.connect(buyer1).batchRevealRegister(nbsBid[0].domain, nbsReveals);
});

describe("☕️ Test DNSRegistry Contract", () => {

    it("should show domain is available", async () => {
        const domain = ethers.namehash("coe.ntu") ;
        expect(await dnsRegistry.available(domain)).to.be.true;
    });

    it("should show domain is unavailable for registered domains", async () => {
        const spms = ethers.namehash("spms.ntu") ;
        expect(await dnsRegistry.available(spms)).to.be.false;
    });

    it("should bulk resolve", async () => {
        const domains = [
            ethers.namehash("spms.ntu"),
            ethers.namehash("nbs.ntu"),
        ]

        // bulk resolve
        const addresses = await dnsRegistry.connect(dnsOwner).bulkResolve(domains);
        expect(addresses.every(address => address === buyer1.address)).to.be.true;
    });
});
