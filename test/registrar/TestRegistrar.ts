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

describe("💻 Test Registrar Contract", () => {

    describe("💸 commit", () => {
        it("should ensure deadline is correct after commiting", async () => {
            const duration = 30;
            await registrar.connect(registrarOwner).setDuration(duration);
            expect(await registrar.getAuctionDuration()).to.equal(duration);

            // Ensure deadline correct
            const domain = "helloworld";
            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
            const value = ethers.parseEther("0.01");

            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);
            await registrar.connect(buyer1).precommit(commitment, {value: value});
            await registrar.connect(buyer1).commit(domain, secretHash);

            const block = await ethers.provider.getBlock("latest");

            const deadline = await registrar.connect(buyer1).auctionDeadline(ethers.keccak256(ethers.toUtf8Bytes(domain)));
            expect(Number(deadline)).equal(block!.timestamp + duration);
        });

        it("should be in effect on first auction commit", async () => {
            const domain = "helloworld";
            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const secret = ethers.keccak256(ethers.toUtf8Bytes(randomSecret()));
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));

            const value = ethers.parseEther("0.01");
            const block = await ethers.provider.getBlock("latest");
            const auctionDuration = await registrar.getAuctionDuration();

            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer2.address, domainHash, secretHash]);
            await registrar.connect(buyer2).precommit(commitment, {value: value});
            await registrar.connect(buyer2).commit(domain, secretHash);

            const expiry = await registrar.expiry(ethers.keccak256(ethers.toUtf8Bytes(domain)));

            expect(expiry).equal(block!.timestamp + TENURE + Number(auctionDuration));
        });

        it("should deny low bid in precommit", async () => {
            const domain = "dydx";
            const secret = randomSecret();
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
            const value = ethers.parseEther("0.001");

            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);

            await expectFailure(
                registrar.connect(buyer1).precommit(commitment, {value: value})
            );
        });

        it("should allow precommit", async () => {
            const domain = "dydx";
            const secret = randomSecret();
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
            const value = ethers.parseEther("0.01");

            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);

            await registrar.connect(buyer1).precommit(commitment, {value: value});
            await registrar.connect(buyer1).commit(domain, secretHash);

            await moveTime(AUCTION_DURATION + 1);

            await registrar.connect(buyer1).revealRegister(domain, {secret, value});
        });

        it("should deny registered domain commit", async () => {
            const domain = "dydx";
            const secret = randomSecret();
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
            const value = ethers.parseEther("0.01");

            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);

            await registrar.connect(buyer1).precommit(commitment, {value: value});

            await expectFailure(
                registrar.connect(buyer1).commit(domain, secretHash)
            );
        });

        it("should refund precommit", async () => {
            const domain = "dydx";
            const secret = randomSecret();
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
            const value = ethers.parseEther("0.01");


            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);

            await registrar.connect(buyer1).precommit(commitment, {value: value});
            await registrar.connect(buyer1).refundPrecommitment(commitment);
        });

        it("should deny refund precommit", async () => {
            const domain = "dydx";
            const secret = randomSecret();
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));

            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);

            expectFailure(
                registrar.connect(buyer1).refundPrecommitment(commitment)
            );
        });

        it("should deny non existent precommit", async () => {
            const domain = "dydx";
            const secret = randomSecret();
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));

            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);

            await expectFailure(
                registrar.connect(buyer1).commit(commitment, secretHash)
            );
        });
    });

    describe("👻 reveal", () => {
        it("should allow commit and reveal", async () => {
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

            const precommits = Object.values(bids).map(async (bid) => {
                const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
                const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [bid.bidder.address, domainHash, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))]);
                await registrar.connect(bid.bidder).precommit(commitment, {value: bid.value});
            });
            await Promise.all(precommits);

            const commits = Object.values(bids).map(async (bid) =>
                registrar.connect(bid.bidder).commit(domain, ethers.keccak256(ethers.toUtf8Bytes(bid.secret)))
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
                registrar.connect(bid.bidder).revealRegister(domain, {secret: bid.secret, value: bid.value}),
            );
            await Promise.all(reveals);

            // Ensure buyer1 is the owner of student.ntu
            expect(await dnsRegistry.addr(ethers.namehash("student.ntu"))).to.equal(buyer1.address);
        });

        it("should fail to register owned domains", async () => {
            const domain = "student";
            const secret = randomSecret();
            const secretHash = ethers.keccak256(ethers.toUtf8Bytes(secret));
            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const value = ethers.parseEther("0.01");

            const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash]);
            await registrar.connect(buyer1).precommit(commitment, {value: value});

            await expectFailure(
                registrar.connect(buyer2).commit(domain, secretHash)
            );
        });

        it("should register multiple domains and list all domains owned", async () => {
            const scseBids = [
                {
                    domain: "scse",
                    domainHash: ethers.keccak256(ethers.toUtf8Bytes("scse")),
                    secret: randomSecret(),
                    value: ethers.parseEther("0.01"),
                },
                {
                    domain: "scse",
                    domainHash: ethers.keccak256(ethers.toUtf8Bytes("scse")),
                    secret: randomSecret(),
                    value: ethers.parseEther("0.012"),
                },
                {
                    domain: "scse",
                    domainHash: ethers.keccak256(ethers.toUtf8Bytes("scse")),
                    secret: randomSecret(),
                    value: ethers.parseEther("0.02"),
                },
            ];

            const nbsBids = [
                {
                    domain: "nbs",
                    domainHash: ethers.keccak256(ethers.toUtf8Bytes("nbs")),
                    secret: randomSecret(),
                    value: ethers.parseEther("0.01"),
                },
                {
                    domain: "nbs",
                    domainHash: ethers.keccak256(ethers.toUtf8Bytes("nbs")),
                    secret: randomSecret(),
                    value: ethers.parseEther("0.012"),
                },
                {
                    domain: "nbs",
                    domainHash: ethers.keccak256(ethers.toUtf8Bytes("nbs")),
                    secret: randomSecret(),
                    value: ethers.parseEther("0.02"),
                },
            ];

            const scsePrecommits = Object.values(scseBids).map(async (bid) => {
                const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(bid.domain)))
                const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer3.address, domainHash, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))]);
                await registrar.connect(buyer3).precommit(commitment, {value: bid.value});
            });
            const nbsPrecommits = Object.values(nbsBids).map(async (bid) => {
                const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(bid.domain)))
                const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer3.address, domainHash, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))]);
                await registrar.connect(buyer3).precommit(commitment, {value: bid.value});
            });
            await Promise.all([...scsePrecommits, ...nbsPrecommits]);

            // Execute commits
            const scseCommits = Object.values(scseBids).map(bid =>
                registrar.connect(buyer3).commit(bid.domain, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))),
            );
            const nbsCommits = Object.values(nbsBids).map(bid =>
                registrar.connect(buyer3).commit(bid.domain, ethers.keccak256(ethers.toUtf8Bytes(bid.secret))),
            );
            await Promise.all([...scseCommits, ...nbsCommits]);

            // Advance time
            await moveTime(AUCTION_DURATION + 1);

            // Reveal
            const scseReveals = Object.values(scseBids).map(bid =>
                ({secret: bid.secret, value: bid.value})
            );
            const nbsReveals = Object.values(nbsBids).map(bid =>
                ({secret: bid.secret, value: bid.value})
            );

            await registrar.connect(buyer3).batchRevealRegister(scseBids[0].domain, scseReveals);
            await registrar.connect(buyer3).batchRevealRegister(nbsBids[0].domain, nbsReveals);

            // Verify events
            const registerFilter = registrar.filters.DomainRegistered(buyer3)
            const registeredEvents = await registrar.queryFilter(registerFilter);

            // Filter out expired domains
            const domains = registeredEvents
                .map(event => event.args)
                .filter(args => args !== undefined && args.expires > Date.now() / 1000)
                .map(args => args!);

            expect(domains.length).equal(2);

            // Verify events
            const bidFailureFilter = registrar.filters.DomainBidFailed(buyer3)
            const bidFailureEvents = await registrar.queryFilter(bidFailureFilter);

            // Filter out expired domains
            const failureBids = bidFailureEvents
                .map(event => event.args)
                .filter(args => args !== undefined && args.expires > Date.now() / 1000)
                .map(args => args!);

            // Remove highest bid
            scseBids.pop();
            nbsBids.pop();


            const scseFailureBids = failureBids.filter(bid => bid.domain === "scse");
            const nbsFailureBids = failureBids.filter(bid => bid.domain === "nbs");

            expect(scseFailureBids.length).equal(1);
            expect(nbsFailureBids.length).equal(1);

            const scseRefund = scseBids.reduce((prev, curr) => prev + curr.value, ethers.parseEther("0"));
            const nbsRefund = nbsBids.reduce((prev, curr) => prev + curr.value, ethers.parseEther("0"));

            expect(scseFailureBids[0].refund).equal(scseRefund);
            expect(nbsFailureBids[0].refund).equal(nbsRefund);
        });
    });

    describe("👨🏻‍💻 post commit-reveal", () => {
        it("should allow setting of cname", async () => {
            await registrar.connect(buyer3).setCName("scse");
            expect(await dnsRegistry.cname(buyer3.address)).equal("scse.ntu");
        });

        it("should not allow setting of cname of not owner", async () => {
            await expectFailure(
                registrar.connect(buyer2).setCName("scse")
            );
        });

        it("should allow rebidding after expiry", async () => {
            const domain = "newdomain";
            const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
            const secret1 = randomSecret();
            const secretHash1 = ethers.keccak256(ethers.toUtf8Bytes(secret1));

            const value = ethers.parseEther("0.01");
            const commitment1 = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer1.address, domainHash, secretHash1]);

            await registrar.connect(buyer1).precommit(commitment1, {value: value});
            await registrar.connect(buyer1).commit(domain, secretHash1);

            await moveTime(AUCTION_DURATION + 1);

            await registrar.connect(buyer1).revealRegister(domain, {secret: secret1, value});
            const owner1 = await dnsRegistry.connect(buyer1).addr(ethers.namehash(`${domain}.ntu`));
            expect(owner1).equal(buyer1.address);


            // Move to 1 year later
            await moveTime(AUCTION_DURATION + GRACE_PERIOD + TENURE);

            const hasDomainExpired = await registrar.hasDomainExpired(ethers.keccak256(ethers.toUtf8Bytes(domain)));
            expect(hasDomainExpired).equal(true);

            // Rebid
            const secret2 = randomSecret();
            const domainHash2 = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))

            const secretHash2 = ethers.keccak256(ethers.toUtf8Bytes(secret2));
            const commitment2 = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [buyer2.address, domainHash2, secretHash2]);

            await registrar.connect(buyer2).precommit(commitment2, {value: value});
            await registrar.connect(buyer2).commit(domain, secretHash2);

            await moveTime(AUCTION_DURATION + 1);

            // Reveal
            await registrar.connect(buyer2).revealRegister(domain, {secret: secret2, value});
            const owner2 = await dnsRegistry.addr(ethers.namehash(`${domain}.ntu`));
            expect(owner2).equal(buyer2.address);
        });
    });
});

