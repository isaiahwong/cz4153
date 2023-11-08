import {ethers} from "hardhat";
import {upgradeDNS, upgradeRegistrar} from "./setup";
import addresses from "../addresses.sepolia.json";

async function main() {
    const accounts = await ethers.getSigners();
    const dnsOwner = accounts[0];

    await upgradeDNS(dnsOwner, addresses.dns);
    await upgradeRegistrar(dnsOwner, addresses.ntuRegistrar);
    await upgradeRegistrar(dnsOwner, addresses.comRegistrar);
    await upgradeRegistrar(dnsOwner, addresses.devRegistrar);
    await upgradeRegistrar(dnsOwner, addresses.xyzRegistrar);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
