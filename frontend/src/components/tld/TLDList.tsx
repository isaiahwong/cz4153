import React, {useEffect, useState} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import _ from "lodash";

import {dnsContract} from "../../api/contract/contract";
import {TLD} from "../../api/dns/dns";

import style from "./TLDList.module.css";
import {useWallet} from "../../api/wallet/wallet";

interface TLDListProps {
    onClick?: (tld?: TLD) => void;
}


function TLDList(props: TLDListProps) {
    const [tlds, setTLDS] = useState<TLD[]>();
    const [selectedTLD, setSelectedTLD] = useState<TLD>();
    const { provider} = useWallet();

    useEffect(() => {
        (async () => {
            const tlds = await dnsContract.getTLDs(provider);
            setTLDS(tlds);
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
        <Grid container className={style.tld} justifyContent={"start"}>
            <Grid item xs={12}>
                <Typography variant="h5" fontWeight="bold">
                    SELECT TOP LEVEL DOMAIN
                </Typography>
            </Grid>
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
        </Grid>
    )

    return !!selectedTLD ? tldSelected : tldItems;
}

TLDList.defaultProps = {
    onClick: (tld: TLD) => {
    }
}

export default TLDList;