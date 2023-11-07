import {ethers} from "hardhat";
import {randomSecret} from "./setup";
import {DNSRegistry__factory, Registrar__factory} from "../frontend/src/api/typechain-types";
import address from "../addresses.sepolia.json";

async function main() {
    const accounts = await ethers.getSigners();
    const owner = accounts[0];

    const dnsRegistry = DNSRegistry__factory.connect(address.dns, owner);
    const registrar = Registrar__factory.connect(address.ntuRegistrar, owner);
    const value = ethers.parseEther("0.003");

    const promises = await Promise.all(
        ["dsai", "spms", "csc"]
            .map(async (domain) => ({
                domain,
                available: (await dnsRegistry.available(ethers.namehash(`${domain}.ntu`)))
            }))
    );

    const domains = promises.filter(({available}) => available).map(({domain}) => domain);
    const secrets = domains.map((bid) => randomSecret());

    console.log("Bidding for domains: ", domains)
    console.log("Precommitting bids")

    const precommits = Object.values(domains)
        .map(async (domain, idx) => {
                const domainHash = await registrar.getDomainFutureVersion(ethers.keccak256(ethers.toUtf8Bytes(domain)))
                const commitment = ethers.solidityPackedKeccak256(["address", "bytes32", "bytes32"], [owner.address, domainHash, ethers.keccak256(ethers.toUtf8Bytes(secrets[idx]))]);
                const tx = await registrar.connect(owner).precommit(commitment, {value});
                await tx.wait();
            }
        );
    await Promise.all(precommits);

    console.log("Commiting bids")
    const commits = Object.values(domains)
        .map(async (bid, idx) => {
                const tx = await registrar.connect(owner).commit(bid, ethers.keccak256(ethers.toUtf8Bytes(secrets[idx])), )
                await tx.wait();
            }
        );
    await Promise.all(commits);
    const auctionDuration = Number((await registrar.getAuctionDuration()));

    console.log("Waiting for auction to end");
    await new Promise((resolve) => setTimeout(resolve, (auctionDuration + 10) * 1000));

    console.log("Revealing commits");
    const reveals = Object.values(domains).map(async (domain, idx) => {
            const tx = await registrar.connect(owner).revealRegister(domain, {secret: secrets[idx], value})
            await tx.wait();
        }
    );
    await Promise.all(reveals);

    console.log("Seed completed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});