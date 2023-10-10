import {useEffect} from "react";
import {Chain} from "../../api/dns/dns";
import {routes} from "../app/App";

export default function ChainNotSupported() {

    useEffect(() => {
        navigate();
    }, []);

    const navigate = async () => {
        if (!window.ethereum) return;
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: `0x${Chain.sepolia.toString(16)}`,
            }]
        });

        window.location.replace(routes.landing);
    }

    return (
        <div id="error-page">
            <h1>Chain is not supported</h1>
            <p>Try Sepolia or run a local node :)</p>
        </div>
    );
}