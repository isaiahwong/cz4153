import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Button from "@mui/material/Button";

import Header from "../../components/header/Header";
import {dnsContract} from "../../api/contract/contract";
import {useWallet} from "../../api/wallet/wallet";
import {WithConnect, WithLoader} from "../../components/hoc/hoc";
import {Box, Grid, TextField, Typography} from '@mui/material';
import CommitmentStore, {Commitment} from "../../store/commits";

import style from "./Domain.module.css";
import {randomSecret} from "../../common/common";

interface BidPanelProps {
    bid: number;
    onBidChange: (e: any) => void;
    onClick: () => void;
}

function BidPanel(props: BidPanelProps) {
    const {bid, onBidChange} = props;
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
                    onClick={props.onClick}
                >
                    <Typography variant="body1" fontWeight="bold">
                        COMMIT
                    </Typography>
                </Button>
            </Box>
        </>
    )
}

function WaitPanel(props: BidPanelProps) {
    const {bid, onClick} = props;
    return (
        <>
            <div onClick={onClick}>

                waiting..
            </div>
        </>
    )
}

enum Stages {
    commit,
    wait,
    reveal,
}

export default function Domain() {
    const {domain} = useParams();
    const [subdomain, setSubdomain] = useState<string>("");
    const [tld, setTLD] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [bid, setBid] = useState(0.003);
    const [stage, setStage] = useState<Stages>(Stages.commit);
    const [submittedCommitment, setSubmittedCommitment] = useState<Commitment | null>(null);

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
        connect();
    }, []);

    useEffect(() => {
        if (!signer || !tld || !subdomain) return;

        // Return if commitment is in state
        if (submittedCommitment) {
            setStage(Stages.wait);
            return;
        }

        CommitmentStore.getCommit(signer.address, tld, subdomain).then((commit) => {
            if (commit) {
                setStage(Stages.wait);
                setSubmittedCommitment(commit);
            }
        });
    }, [signer, submittedCommitment, tld]);

    const onBidChange = (e: any) => {
        setBid(e.target.value);
    }

    const onCommit = async () => {
        if (!signer) {
            await connect();
            return;
        }

        const commitment = {
            owner: signer?.address!,
            tld: tld!,
            subdomain: subdomain!,
            secret: randomSecret(),
            value: bid.toString()
        }

        await dnsContract.commit(provider, signer, commitment.secret, tld!, subdomain!, commitment.value)
        await CommitmentStore.addCommit(commitment);
        setSubmittedCommitment(commitment);
    }

    const onReveal = async () => {
        if (!signer) {
            await connect();
            return;
        }

        if (!submittedCommitment) return;

        await dnsContract.reveal(provider, signer, submittedCommitment.secret, tld!, subdomain!, submittedCommitment.value)
        await CommitmentStore.deleteCommit(submittedCommitment);
    }

    const processStage = () => {
        switch (stage) {
            case Stages.commit:
                return <BidPanel bid={bid} onBidChange={onBidChange} onClick={onCommit}/>;
            case Stages.wait:
                return <WaitPanel bid={bid} onBidChange={onBidChange} onClick={onReveal}/>;
            case Stages.reveal:
                return <BidPanel bid={bid} onBidChange={onBidChange} onClick={onCommit}/>;
        }

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
                                <WithConnect onClick={() => connect()} pred={!!signer}>
                                    {processStage()}
                                </WithConnect>

                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </WithLoader>
        </>
    );
}