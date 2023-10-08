import crypto from "crypto-js";

export function randomSecret() {
    return (
        '0x' + crypto.lib.WordArray.random(24).toString()
    )
}