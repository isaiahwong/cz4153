import React from 'react';
import {Route, Routes} from "react-router-dom";
import Header from "../../components/header/Header";
import Landing from '../landing/Landing';

import './App.css';
import NotFound from "../error/NotFound";

export default function App() {
    return (
    <div className="App">
        <Header/>
        <Routes>
            <Route index element={<Landing />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}