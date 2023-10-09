import React from 'react';
import {Route, Routes} from "react-router-dom";
import Landing from '../landing/Landing';
import NeedWallet from '../wallet/NeedWallet';

import './App.css';
import NotFound from "../error/NotFound";
import PrivateRoute from "../../components/hoc/Auth";
import Domain from "../domain/Domain";
import {listenToEvents} from "../../api/wallet/wallet";
import {createTheme, ThemeProvider} from "@mui/material";

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

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<PrivateRoute/>}>
                        <Route index path="" element={<Landing/>}/>
                        <Route path="/d/:domain" element={<Domain/>}/>
                    </Route>
                    <Route path="/need-wallet" element={<NeedWallet/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
        </ThemeProvider>

    );
}