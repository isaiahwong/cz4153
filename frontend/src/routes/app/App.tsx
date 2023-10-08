import React from 'react';
import {Route, Routes} from "react-router-dom";
import Header from "../../components/header/Header";
import Landing from '../landing/Landing';
import NeedWallet from '../wallet/NeedWallet';

import './App.css';
import NotFound from "../error/NotFound";
import PrivateRoute from "../../components/hoc/Auth";
import {Switch} from "@mui/material";
import Domain from "../domain/Domain";
import {listenToEvents} from "../../api/wallet/wallet";

listenToEvents();

export default function App() {
    return (
    <div className="App">
        <Routes>
            <Route path="/" element={<PrivateRoute />}>
                <Route index path="" element={<Landing />} />
                <Route path="/d/:domain" element={<Domain />} />
            </Route>
            <Route path="/need-wallet" element={<NeedWallet />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}