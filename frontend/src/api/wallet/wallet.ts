import {useEffect, useState} from "react";
import  {ethers, parseEther, BrowserProvider, JsonRpcSigner, Network} from "ethers";

declare global {
    interface Window {
        ethereum: any;
    }
}

type ExtensionForProvider = {
    on: (event: string, callback: (...params: any) => void) => void;
};

type GenericProvider = BrowserProvider & ExtensionForProvider;

interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

const setupProvider = () => {
    if (!window.ethereum) throw Error('Could not find wallet extension');
    const newProvider = new BrowserProvider(window.ethereum);
    listenToEvents(newProvider);

    return newProvider
}

const listenToEvents = (provider: BrowserProvider) => {
    (window.ethereum as GenericProvider).on('chainChanged', async (net: number) => {
        window.location.reload();
    });
    (window.ethereum as GenericProvider).on('disconnect', (error: ProviderRpcError) => {
        throw Error(error.message);
    });
}

function useWallet() {
    const provider = setupProvider();
    const [hasWallet, setHasWallet] = useState<boolean>(!!window.ethereum);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [network, setNetwork] = useState<Network | null>(null);


    const connect = async () => {
        if (!window.ethereum) throw Error('Could not find wallet extension');

        const network: Network = await provider.getNetwork();
        const signer: JsonRpcSigner = await provider.getSigner();
        setNetwork(network);
        setSigner(signer);
    }

    const sendTransaction = async (from: string, to: string, valueInEther: string) =>  {
        const params = [{
            from,
            to,
            value: parseEther( valueInEther)
        }];
        const transactionHash = await provider.send('eth_sendTransaction', params);
        return transactionHash;
    }


    return {
        hasWallet,
        signer,
        provider,
        network,
        connect,
        sendTransaction
    }
}

export { useWallet }
