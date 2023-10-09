import crypto from "crypto-js";
import {BrowserProvider, ethers} from "ethers";

export function randomSecret() {
    return (
        '0x' + crypto.lib.WordArray.random(24).toString()
    )
}

export async function timeDiffFromBlock(provider: BrowserProvider, future: number) {
    const now = (await provider.getBlock("latest"))!.timestamp;
    return future - Number(now);
}
