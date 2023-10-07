import React from 'react';
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";

export default function Domain() {
    let { tld, domain } = useParams();

    console.log(tld, domain);

    return (
        <>
            <Header/>
            <div>
                Domain
            </div>
        </>

    );
}