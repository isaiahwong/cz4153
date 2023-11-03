import crypto from "crypto-js";
import {BrowserProvider} from "ethers";

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

export function tryAlert(e: any) {
    if (!(e instanceof Error)) {
        return;
    }
    if (e.message.includes("insufficient")) {
        alert("Insufficient funds");
        return;
    }
    if (e.message.includes("nonce") || e.message.includes("Nonce")) {
        alert("Nonce too high. Try resetting it");
        return;
    }
    if (e.message.includes("coalesce error")) {
        alert("Try unlocking metamask");
        return;
    }
    console.error(e)
    return;
}

export async function getBlockTime(provider: BrowserProvider) {
    return (await provider.getBlock("latest"))!.timestamp;
}