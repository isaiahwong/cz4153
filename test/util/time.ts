import {ethers} from "hardhat";


export async function moveTime(time: number) {
    const block = await ethers.provider.getBlock("latest");
    await ethers.provider.send("evm_mine", [block!.timestamp + time]);
}