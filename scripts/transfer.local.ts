import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";

const ERROR_MSG = "Please run: npm run transfer <address>";

interface Args {
    address: string;
}

async function main(hre: HardhatRuntimeEnvironment, taskArgs: Args) {
    const address = taskArgs.address;

    if (address === undefined) {
        console.log(ERROR_MSG);
        return;
    }

    const accounts = await hre.ethers.getSigners();
    const dummyAccount = accounts[3];
    const tx = await dummyAccount.sendTransaction({to: address, value: hre.ethers.parseEther("100")});
    await tx.wait();
    console.log(`Transferred 100 ETH to ${address}`);
}

task("transfer", "Transfer test ether to an address")
    .addPositionalParam("address", "address")
    .setAction(async (taskArgs, hre) => {
        await main(hre, taskArgs);
    });