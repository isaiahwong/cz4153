import crypto from "crypto-js";

export function randomSecret() {
    return (
        '0x' + crypto.lib.WordArray.random(24).toString()
    )
}

export function timeDiffNowSec(future: number) {
    return future - Math.round(Date.now() / 1000)
}
