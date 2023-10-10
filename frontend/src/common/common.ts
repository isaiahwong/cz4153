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

export default function truncateAddress(address?: string) {
    if (!address) {
        return "";
    }
    return address.slice(0, 6) + "..." + address.slice(-4);
}