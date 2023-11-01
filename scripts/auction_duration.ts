import {Registrar__factory} from "../frontend/src/api/typechain-types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ContractRunner} from "ethers";


const ERROR_MSG = "Please run: npm run auction_duration <registrarName> <duration>";


export async function changeAuction(duration: number, address: string, signer: ContractRunner) {
    if (!duration || !address) {
        console.log(ERROR_MSG);
        return;
    }

    const registrar = Registrar__factory.connect(address, signer);
    const tx = await registrar.connect(signer).setDuration(duration);
    await tx.wait();
    console.log("Auction Duration Changed")
}
