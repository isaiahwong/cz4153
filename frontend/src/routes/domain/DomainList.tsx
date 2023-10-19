import React, {useEffect} from "react";

import Header from "../../components/header/Header";
import DomainPanel, {Domain} from "../../components/panels/DomainsPanel";
import {dnsContract} from "../../api/dns/dns";
import {useWallet} from "../../api/wallet/wallet";

import style from "./DomainList.module.css";
import {Box, Grid, Typography,} from "@mui/material";
import {WithLoader} from "../../components/hoc/hoc";

export default function DomainList() {
    const {provider, signer} = useWallet();
    const [domains, setDomains] = React.useState<Domain[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        getOwnersDomains();
    }, []);

    const getOwnersDomains = async () => {
        const tlds = await dnsContract.getTLDs(provider);
        const domains = await Promise.all(
            tlds.map((tld) =>
                dnsContract.getDomainRegistered(provider, tld.name, undefined, undefined)
            ))
            .then((results) => results.flatMap((events) => events))
            .then((events) => events.map((event) => event.args))
            .then((args) => args.filter((arg) =>
                arg.expires > BigInt(Math.round(Date.now() / 1000))
            ))
            .then((args) => args.map<Domain>((arg) => ({
                name: arg.domain,
                tld: arg.tld,
                owner: arg.owner,
                expires: Number(arg.expires)
            })).sort((a, b) => a.tld > b.tld ? 1 : -1));
        setDomains(domains);
        setLoading(false);
    }

    return (
        <>
            <Header/>
            <Grid container className={style.content} alignContent={"center"} alignItems="center">
                <Grid item xs={12}>
                    <Box className={style.wrapper}>
                        <Typography variant={"h5"} fontWeight={"900"}>
                            All Registered Domains
                        </Typography>
                        <Box
                            className={style.panel}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <WithLoader loading={loading}>
                                <DomainPanel domains={domains} showOwner/>
                            </WithLoader>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}