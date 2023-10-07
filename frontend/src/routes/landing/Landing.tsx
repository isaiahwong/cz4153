import React, {useEffect} from 'react';
import {Grid} from '@mui/material';


import style from "./Landing.module.css";
import {dnsContract} from "../../api/contract/contract";
import TLDList from "../../components/tld/TLDList";

export default function Landing() {
    useEffect(() => {
        loadTLD();
    }, []);

    const loadTLD = async () => {
        await dnsContract.getTLDs();
    }
    return (
        <Grid container className={style.content} alignContent={"center"} alignItems="center">
            <Grid item xs={12}>
                <TLDList/>
                {/*<Autocomplete*/}
                {/*    className={style.search}*/}
                {/*    id="free-solo-demo"*/}
                {/*    freeSolo*/}
                {/*    options={["s"].map((option) => option)}*/}
                {/*    renderInput={(params) => <TextField {...params} label="Search for DNS"/>}*/}
                {/*/>*/}
            </Grid>
        </Grid>
    )
}