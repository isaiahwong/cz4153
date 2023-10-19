import React, {useEffect, useState} from 'react';
import Header from "../../components/header/Header";
import {useWallet} from "../../api/wallet/wallet";

import style from "./SendEther.module.css";
import {Box, Grid, TextField, Typography} from "@mui/material";
import {WithConnect, WithLoader} from "../../components/hoc/hoc";
import TransactionPanel from "../../components/panels/TransactionPanel";

export default function SendEther() {
    return (
        <>
            <Header/>
            <Grid container className={style.content} alignContent={"center"} alignItems="center">
                <Grid item xs={12}>
                    <Box className={style.wrapper}>
                        <Typography variant={"h4"} fontWeight={"900"}>
                            Send Ether to a DNS
                        </Typography>

                        <Box
                            className={style.panel}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <TransactionPanel/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}