import React, {useEffect} from "react";
import Header from "../../components/header/Header";
import style from "./DomainCommon.module.css";
import {Box, Grid, Typography} from "@mui/material";
import AuctionPanel from "../../components/panels/AuctionPanel";


export default function DomainOngoingAuctions() {
    return (
        <>
            <Header/>
            <Grid container className={style.content} alignContent={"center"} alignItems="center">
                <Grid item xs={12}>
                    <Box className={style.wrapper}>
                        <Typography variant={"h5"} fontWeight={"900"}>
                            Auctions
                        </Typography>
                        <Box
                            className={style.panel}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <AuctionPanel />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>

    );
}