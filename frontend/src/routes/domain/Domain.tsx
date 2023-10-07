import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import Header from "../../components/header/Header";
import {dnsContract} from "../../api/contract/contract";
import {useWallet} from "../../api/wallet/wallet";
import {WithLoader} from "../../components/hoc/hoc";
import {Box, Grid, TextField, Typography} from '@mui/material';

import style from "./Domain.module.css";
import Button from "@mui/material/Button";

interface BidPanelProps {
    bid: number;
    onBidChange: (e: any) => void;
    onCommit: () => void;
}

function BidPanel(props: BidPanelProps) {
    const { bid, onBidChange } = props;
    return (
        <>
            <TextField
                className={style.field}
                type="number"
                label="Enter Bid"
                onChange={onBidChange}
                error={bid < 0.003}
                helperText={bid < 0.003 ? "Bid must be at least 0.003 ETH" : ""}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Box mt={2}>
                <Button
                    variant="contained"
                    className={style.button}
                    onClick={props.onCommit}
                >
                    <Typography variant="body1" fontWeight="bold">
                        COMMIT
                    </Typography>
                </Button>
            </Box>
        </>
    )
}

export default function Domain() {
    const {domain} = useParams();
    const [subdomain, setSubdomain] = useState<string>("");
    const [tld, setTLD] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [bid, setBid] = useState(0.003);

    const navigate = useNavigate();
    const {provider, signer, connect} = useWallet();

    if (!domain) {
        navigate('/');
    }

    useEffect(() => {
        const tld = domain!.split('.').pop();
        dnsContract.isValidTLD(provider, tld!).then((valid) => {
            if (!valid) navigate('/');
            setLoading(!valid);
            setTLD(tld!);
            setSubdomain(domain!.replace(`.${tld}`, ''));
        })
    }, []);

    const onBidChange = (e: any) => {
        setBid(e.target.value);
    }

    const onCommit = async () => {
        if (!signer) {
            await connect();
            return;
        }
        await dnsContract.commit(provider, signer,"123", tld!, subdomain!, bid)

    }


    return (
        <>
            <Header/>
            <WithLoader pred={loading}>
                <Grid container className={style.content} alignContent={"center"} alignItems="center">
                    <Grid xs={12}>
                        <Box className={style.wrapper}>
                            <Typography variant="h5" fontWeight="bold">
                                {domain}
                            </Typography>
                            <Box
                                className={style.panel}
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <BidPanel
                                    bid={bid}
                                    onBidChange={onBidChange}
                                    onCommit={onCommit}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </WithLoader>
        </>
    );
}