import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
import Landing from '../landing/Landing';
import NeedWallet from '../wallet/NeedWallet';

import './App.css';
import NotFound from "../error/NotFound";
import PrivateRoute from "../../components/hoc/Auth";
import Domain from "../domain/Domain";
import {listenToEvents, useWallet} from "../../api/wallet/wallet";
import {createTheme, ThemeProvider} from "@mui/material";
import {Address} from "../address/Address";
import ChainNotSupported from "../error/ChainNotSupported";
import {setDNSAddr} from "../../api/dns/dns";
import {WithLoader} from "../../components/hoc/hoc";

listenToEvents();

const theme = createTheme({
    typography: {
        fontFamily: [
            'Lato',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(',') // Specify Lato as the primary font
    },
});

export const routes: Record<string, any> = {
    "landing": "/",
    "domainRoot": "/domain/:domain",
    "domain": (domain: string) => `/domain/${domain}`,
    "addressRoot": "/address/:address",
    "address": (address: string) => `/address/${address}`,
    "needWallet": "/need-wallet",
    "chainNotSupported": "/chain-not-supported",
    "notFound": "/not-found"
}

export default function App() {
    const {provider} = useWallet();

    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const net = await provider.getNetwork();
        await setDNSAddr(Number(net.chainId));
        setLoading(false);
    }

    return (
        <WithLoader loading={loading}>
            <ThemeProvider theme={theme}>
                <div className="App">
                    <Routes>
                        <Route path={routes.landing} element={<PrivateRoute/>}>
                            <Route index path="" element={<Landing/>}/>
                            <Route path={routes.addressRoot} element={<Address/>}/>
                            <Route path={routes.domainRoot} element={<Domain/>}/>
                        </Route>
                        <Route path={routes.chainNotSupported} element={<ChainNotSupported />}/>
                        <Route path={routes.needWallet} element={<NeedWallet/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </ThemeProvider>
        </WithLoader>
    );
}