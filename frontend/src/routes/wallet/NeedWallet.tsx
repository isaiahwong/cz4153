import React from "react";
import { Navigate } from "react-router-dom";
import {useWallet} from "../../api/wallet/wallet";

export default function NeedWallet() {
    const {hasWallet} = useWallet();

    if (hasWallet) {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>You need a wallet extension installed to use the app</p>
        </div>
    );
}