import {ContractRunner} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";


const ERROR_MSG = "Please run: npm run auction_duration <registrarName> <duration>";


export async function changeAuction(hre: HardhatRuntimeEnvironment, duration: number, address: string, signer: ContractRunner) {
    if (!duration || !address) {
        console.log(ERROR_MSG);
        return;
    }
    const registrarFactory = await hre.ethers.getContractFactory("Registrar");
    const Registrar = registrarFactory.connect(signer);
    const registrar = await Registrar.attach(address);

    // @ts-ignore
    const tx = await registrar.connect(signer).setDuration(duration);
    await tx.wait();
    console.log("Auction Duration Changed")
}
