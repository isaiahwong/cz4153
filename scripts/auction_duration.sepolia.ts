import addresses from "../addresses.sepolia.json"
import { task } from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {changeAuction} from "./auction_duration";

const Auction_durationLocal = 1 * 60; // 1 minutes

const ERROR_MSG = "Please run: npm run auction_duration <registrarName> <duration>";

interface Args {
    registrarName: string;
    duration: number;
}

async function main(hre: HardhatRuntimeEnvironment, taskArgs: Args) {
    const registrarName = taskArgs.registrarName;
    const duration = taskArgs.duration || Auction_durationLocal;

    if (registrarName === undefined || !(registrarName in addresses)) {
        console.log(ERROR_MSG);
        return;
    }

    const accounts = await hre.ethers.getSigners();
    const registrarOwner = accounts[0];

    // @ts-ignore
    await changeAuction(hre, duration, addresses[registrarName], registrarOwner);
}

task("auction_duration_sepolia", "Set auction duration for a registrar")
    .addPositionalParam("registrarName", "The name of the registrar")
    .addPositionalParam("duration", "The duration of the auction in seconds")
    .setAction(async (taskArgs, hre) => {
        await main(hre, taskArgs);
    });
