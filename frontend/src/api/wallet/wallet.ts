import {ethers} from "ethers";
import {useEffect, useState} from "react";
import {JsonRpcSigner} from "ethers/lib.esm";

declare var window: any;

class Wallet {
    provider!: ethers.BrowserProvider;
    private _signer!: ethers.JsonRpcSigner;
    private _network!: ethers.Network;
    private _ready: boolean = false;


    get signer() {
        return this._signer;
    }

    get network() {
        return this._network;
    }

    get ready() {
        return this._ready;
    }

    async connectWallet() {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this._signer = await this.provider.getSigner();
        this._network = await this._signer.provider.getNetwork()
        this._ready = true;
    }

}

const walletSingleton = new Wallet();
walletSingleton.connectWallet();

export function useWallet() {
    const [wallet, _] = useState<Wallet>(walletSingleton);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        waitReady();
    }, []);

    const waitReady = async () => {
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (wallet.ready) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 1);
        });
        setReady(true);
    }

    return {wallet, ready};
}

export default walletSingleton;

