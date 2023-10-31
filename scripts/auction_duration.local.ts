import addresses from "../addresses.local.json"
import {Registrar__factory} from "../frontend/src/api/typechain-types";
import { task } from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";

const AUCTION_DURATION = 1 * 60; // 1 minutes

const ERROR_MSG = "Please run: npm run auction_duration <registrarName> <duration>";

function tryParse(i: string, defaultVal: number) {
    try {
        return parseInt(i);
    } catch (e) {
        console.log("Error in supplied duration, using default auction duration of 1 minute");
        return defaultVal;
    }
}

interface Args {
    registrarName: string;
    duration: number;
}

async function main(hre: HardhatRuntimeEnvironment, taskArgs: Args) {
    const registrarName = taskArgs.registrarName;
    const duration = taskArgs.duration || AUCTION_DURATION;

    if (registrarName === undefined || !(registrarName in addresses)) {
        console.log(ERROR_MSG);
        return;
    }

    const accounts = await hre.ethers.getSigners();
    const registrarOwner = accounts[1];

    // @ts-ignore
    const registrar = Registrar__factory.connect(addresses[registrarName], registrarOwner);
    const tx = await registrar.connect(registrarOwner).setDuration(duration);
    await tx.wait();
    console.log("Auction Duration Changed")
}

task("auction_duration", "Set auction duration for a registrar")
    .addPositionalParam("registrarName", "The name of the registrar")
    .addPositionalParam("duration", "The duration of the auction in seconds")
    .setAction(async (taskArgs, hre) => {
        await main(hre, taskArgs);
    });
