import React, {useEffect} from "react";

import Header from "../../components/header/Header";
import DomainPanel from "../../components/panels/DomainsPanel";
import {Domain, dnsContract} from "../../api/dns/dns";
import {useWallet} from "../../api/wallet/wallet";

import {Box, Grid, Typography,} from "@mui/material";
import {WithLoader} from "../../components/hoc/hoc";
import style from "./DomainCommon.module.css";

export default function DomainList() {
    const {provider, signer} = useWallet();
    const [domains, setDomains] = React.useState<Domain[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        getOwnersDomains();
    }, []);

    const getOwnersDomains = async () => {
        const domains = await dnsContract.getAllDomainRegistered(provider);
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