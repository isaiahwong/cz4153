import React, {useEffect} from "react";
import {Navigate, useParams} from "react-router-dom";
import {Box, Grid, Typography} from "@mui/material";
import {ethers} from "ethers";
import Header from "../../components/header/Header";

import style from "./Address.module.css";
import {routes} from "../app/App";
import {dnsContract} from "../../api/contract/contract";
import {useWallet} from "../../api/wallet/wallet";
import {WithLoader} from "../../components/hoc/hoc";
import DomainPanel, {Domain} from "../../components/panels/DomainsPanel";

const CName = () => {
    return (
        <Box borderBottom={"1px solid black"}>
            <Typography variant={"h5"} fontWeight={"bold"}>
                CNAME
            </Typography>
            <Typography variant={"body1"}>
                Set your canonical domain to your address
            </Typography>
        </Box>
    )
}

export function Address() {
    const {address} = useParams();
    const {provider} = useWallet();

    const [domains, setDomains] = React.useState<Domain[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        getOwnersDomains();
    }, []);

    const getOwnersDomains = async () => {
        const tlds = await dnsContract.getTLDs(provider);

        const domains = await Promise.all(
            tlds.map((tld) =>
                dnsContract.getSubdomainRegistered(provider, tld.name, address, undefined)
            ))
            .then((results) => results.flatMap((events) => events))
            .then((events) => events.map((event) => event.args))
            .then((args) => args.filter((arg) =>
                arg.owner == address && arg.expires > BigInt(Math.round(Date.now() / 1000))
            ))
            .then((args) => args.map<Domain>((arg) => ({name: arg.subdomain, tld: arg.tld, expires: Number(arg.expires)})));
        setDomains(domains);
        setLoading(false);
    }


    // Validate address
    if (!ethers.isAddress(address)) {
        return <Navigate to={routes.notFound}/>
    }

    return (
        <>
            <Header/>
            <Grid container className={style.content} alignContent={"center"} alignItems="center">
                <Grid item xs={12}>
                    <Box className={style.wrapper}>
                        <Box
                            className={style.panel}
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"left"}
                        >
                            <Box mb={4}>
                                <Typography variant="h6" fontWeight="bold" className={style.highlight}>
                                    {address}
                                </Typography>
                            </Box>
                            <WithLoader pred={loading}>
                                {/*<CName/>*/}
                                <DomainPanel domains={domains}/>
                            </WithLoader>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}