import {ethers} from "hardhat";
import {deployDNS, deployRegistrar, writeContractAddresses} from "./setup";

const AUCTION_DURATION = 1 * 60; // 1 minutes

async function main() {
    const accounts = await ethers.getSigners();
    const dnsOwner = accounts[0];
    const ntuRegistrarOwner = accounts[1];

    const dns = await deployDNS(dnsOwner);
    const ntuRegistrar = await deployRegistrar(ntuRegistrarOwner, dns, "ntu", AUCTION_DURATION);
    const devRegistrar = await deployRegistrar(ntuRegistrarOwner, dns, "dev", AUCTION_DURATION);
    const comRegistrar = await deployRegistrar(ntuRegistrarOwner, dns, "com", AUCTION_DURATION);
    const xyzRegistrar = await deployRegistrar(ntuRegistrarOwner, dns, "xyz", AUCTION_DURATION);

    await writeContractAddresses(
        {
            "dns": dns.target.toString(),
            "ntuRegistrar": ntuRegistrar.target.toString(),
            "devRegistrar": devRegistrar.target.toString(),
            "comRegistrar": comRegistrar.target.toString(),
            "xyzRegistrar": xyzRegistrar.target.toString(),
        },
        ".sepolia"
    );
    console.log("Deployed to sepolia network");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
