import {ethers} from "hardhat";
import {upgradeDNS, upgradeRegistrar} from "./setup";
import addresses from "../addresses.local.json";

async function main() {
    const accounts = await ethers.getSigners();
    const dnsOwner = accounts[0];
    const registrarOwner = accounts[1];

    await upgradeDNS(dnsOwner, addresses.dns);
    await upgradeRegistrar(registrarOwner, addresses.ntuRegistrar);
    await upgradeRegistrar(registrarOwner, addresses.comRegistrar);
    await upgradeRegistrar(registrarOwner, addresses.devRegistrar);
    await upgradeRegistrar(registrarOwner, addresses.xyzRegistrar);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
