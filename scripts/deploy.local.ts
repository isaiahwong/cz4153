import { ethers } from "hardhat";
import {deployDNS, deployRegistrar, writeContractAddresses} from "./setup";

const AUCTION_DURATION = 3 * 60; // 3 minutes

async function main() {
  const accounts = await ethers.getSigners();
  const dnsOwner = accounts[0];
  const ntuRegistrarOwner = accounts[1];

  const dns = await deployDNS(dnsOwner);
  const ntuRegistrar = await deployRegistrar(ntuRegistrarOwner, dns, "ntu", AUCTION_DURATION);

  await writeContractAddresses(
      {
        "dns": dns.target.toString(),
        "ntuRegistrar": ntuRegistrar.target.toString(),
      },
      ".local"
  );
  console.log("Deployed to local network");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
