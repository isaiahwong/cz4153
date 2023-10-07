import React from 'react';
import {Navigate, Outlet, Route} from "react-router-dom";
import {useWallet} from "../../api/wallet/wallet";

export default function PrivateRoute() {
    const {hasWallet} = useWallet();
    return hasWallet ? <Outlet /> : <Navigate to="/need-wallet" />;
}

