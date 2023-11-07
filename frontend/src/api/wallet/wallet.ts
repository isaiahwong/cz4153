import {useState} from "react";
import {BrowserProvider, JsonRpcSigner, Network} from "ethers";
import {dnsContract, Chain} from "../dns/dns";
import {routes} from "../../routes/app/App";
import CommitmentStore from "../../store/commits";
import PrecommitmentStore from "../../store/precommits";
import FQDNStore from "../../store/domains";
import {tryAlert} from "../../common/common";

declare global {
    interface Window {
        ethereum: any;
    }
}

export type ExtensionForProvider = {
    on: (event: string, callback: (...params: any) => void) => void;
};

export type GenericProvider = BrowserProvider & ExtensionForProvider;

interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

const setupProvider = () => {
    if (!window.ethereum) throw Error('Could not find wallet extension');
    return new BrowserProvider(window.ethereum);
}

export const isValidChain = (chain: number) => chain === Chain.local.valueOf() || chain === Chain.sepolia.valueOf();

export const listenToEvents = () => {
    if (!window.ethereum) return;
    (window.ethereum as GenericProvider).on('chainChanged', async (chain: number) => {
        chain = parseInt(chain.toString());
        if (isValidChain(chain)) {
            window.location.replace(routes.landing);
            // reset stores
            await CommitmentStore.clear();
            await PrecommitmentStore.clear();
            await FQDNStore.clear();
            return;
        }
        window.location.replace(routes.chainNotSupported);
    });
    (window.ethereum as GenericProvider).on('accountsChanged', (error: ProviderRpcError) => {
        window.location.reload();
    });
    (window.ethereum as GenericProvider).on('disconnect', (error: ProviderRpcError) => {
        window.location.reload();
    });
}

/**
 * React hook to interact with the browser wallet.
 */
function useWallet() {
    const provider = setupProvider();
    const [hasWallet, setHasWallet] = useState<boolean>(!!window.ethereum);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [network, setNetwork] = useState<Network | null>(null);

    const connect = async () => {
        if (!window.ethereum) throw Error('Could not find wallet extension');
        try {
            const network: Network = await provider.getNetwork();
            const signer: JsonRpcSigner = await provider.getSigner();
            setNetwork(network);
            setSigner(signer);
        } catch (e) {
            tryAlert(e)
        }
    }

    return {
        hasWallet,
        signer,
        provider,
        network,
        connect,
    }
}

export {useWallet}
