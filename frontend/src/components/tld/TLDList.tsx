import React, {useEffect, useState} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import _ from "lodash";

import {dnsContract} from "../../api/dns/dns";
import {TLD} from "../../api/dns/dns";

import style from "./TLDList.module.css";
import {useWallet} from "../../api/wallet/wallet";
import {WithLoader} from "../hoc/hoc";

interface TLDListProps {
    onClick?: (tld?: TLD) => void;
}


function TLDList(props: TLDListProps) {
    const [tlds, setTLDS] = useState<TLD[]>();
    const [selectedTLD, setSelectedTLD] = useState<TLD>();
    const [loading, setLoading] = useState<boolean>(true);
    const { provider} = useWallet();

    useEffect(() => {
        (async () => {
            const tlds = await dnsContract.getTLDs(provider);
            setTLDS(tlds);
            setLoading(false);
        })();
    }, []);

    const onClick = (tld: TLD) => {
        props.onClick?.(tld);
        setSelectedTLD(tld);
    }

    const onBack = () => {
        setSelectedTLD(undefined);
        props.onClick?.(undefined);
    }

    const tldSelected = (
        <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Grid display="flex" className={style.back} onClick={onBack}>
                <ArrowBackIcon style={{marginRight: "5px"}}/>
                <Typography variant="body1" fontWeight="bold">
                    BACK
                </Typography>
            </Grid>
            <Box className={style.selectedTLD} flexDirection={"column"} justifyContent={"center"} display={"flex"}>
                <Typography variant="h6" fontWeight="bold">
                    {_.toUpper(selectedTLD?.name)}
                </Typography>
            </Box>
        </Grid>
    );

    const tldItems = (
        <Box className={style.tld} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <WithLoader loading={loading}>
                <Box mb={2}>
                    <Typography variant="h5" fontWeight="bold">
                        SELECT TOP LEVEL DOMAIN
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {tlds?.map((tld, i) => (
                        <Grid key={i} item xs={3} onClick={() => onClick(tld)}>
                            <Box className={style.item} flexDirection={"column"} justifyContent={"center"} display={"flex"}>
                                <Typography variant="h6" fontWeight="bold">
                                    {_.toUpper(tld.name)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </WithLoader>
        </Box>
    )

    return !!selectedTLD ? tldSelected : tldItems;
}

TLDList.defaultProps = {
    onClick: (tld: TLD) => {
    }
}

export default TLDList;