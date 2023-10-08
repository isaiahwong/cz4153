import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import Button from "@mui/material/Button";

import Header from "../../components/header/Header";
import {dnsContract} from "../../api/contract/contract";
import {useWallet} from "../../api/wallet/wallet";
import {WithConnect, WithLoader} from "../../components/hoc/hoc";
import {Box, Grid, TextField, Typography} from '@mui/material';
import CommitmentStore, {Commitment} from "../../store/commits";

import style from "./Domain.module.css";
import {randomSecret} from "../../common/common";
import {ContractEventPayload} from "ethers";

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

interface WaitPanelProps {
    commitment: Commitment | null;
    onAuctionEnded: () => void;
}

function WaitPanel(props: WaitPanelProps) {
    const {commitment, onAuctionEnded} = props;
    const {provider} = useWallet();


    useEffect(() => {
        if (!commitment) return;
        getDeadline();
    }, []);

    if (!commitment) {
        return <Navigate to={'/'}/>;
    }

    const getDeadline = async () => {
        const deadline = await dnsContract.getAuctionDeadline(provider, commitment.tld, commitment.subdomain);
        let remain = deadline - BigInt(Math.round(Date.now() / 1000));

        // Deadline 0 means auction has not started yet
        if (Number(deadline) != 0 && remain < 0) {
            onAuctionEnded();
            return;
        }

        if (remain < 0) {
            remain = BigInt(1);
        }
        console.log(remain)
        setTimeout(getDeadline, Number(remain) * 1000);
    }

    if (!commitment) {
        return <Navigate to={'/'}/>;
    }

    return (
        <>
            <div>

                waiting..
            </div>
        </>
    )
}

interface RevealPanelProps {
    onClick: () => void;
}

function RevealPanel(props: RevealPanelProps) {
    const {onClick} = props;
    return (
        <>
            <div onClick={onClick}>

                reveal..
            </div>
        </>
    )
}


function OwnerPanel() {
    return (
        <>
            <div>

                owner..
            </div>
        </>
    )
}

enum Stages {
    commit,
    wait,
    reveal,
    owner
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

    // Initializations
    useEffect(() => {
        // Attempt to connect
        connect();

        // Ensure domain is valid
        const tld = domain!.split('.').pop();
        dnsContract.isValidTLD(provider, tld!).then((valid) => {
            if (!valid) navigate('/');
            const subdomain = domain!.replace(`.${tld}`, '');
            setLoading(!valid);
            setTLD(tld!);
            setSubdomain(subdomain);

            dnsContract.onRegisteredDomains(provider, tld!, subdomain, onDomainRegistered);
        })

        return () => {
            console.log("unsubscribing", tld, subdomain)
            dnsContract.offRegisteredDomains(provider, tld!, subdomain!, onDomainRegistered);
        }
    }, []);

    useEffect(() => {
        Promise.all([waitStage(), ownerStage()]);
    }, [signer, submittedCommitment, tld]);

    const waitStage = async () => {
        if (!signer || !tld || !subdomain) return;

        // Return if commitment is in state
        if (submittedCommitment) {
            setStage(Stages.wait);
            return;
        }

        const commitment = await CommitmentStore.getCommit(signer.address, tld, subdomain);
        if (commitment) {
            setStage(Stages.wait);
            setSubmittedCommitment(commitment);
        }
    }

    const revealStage = () => {
        setStage(Stages.reveal);
    }

    const ownerStage = async () => {
        if (!signer || !subdomain || !tld) return;
        const addr = await dnsContract.getAddr(provider, `${subdomain}.${tld}`);
        if (addr === signer.address) {
            setStage(Stages.owner);
        }
    }

    const onDomainRegistered = async (event: ContractEventPayload) => {
        if (!event.args) return;

        if (event.args.expires < BigInt(Math.round(Date.now() / 1000))) return;
        if (!signer) return;

        if (event.args.owner === signer.address) {
            await ownerStage();
        }
    }

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
                return <WaitPanel commitment={submittedCommitment} onAuctionEnded={revealStage}/>;
            case Stages.reveal:
                return <RevealPanel onClick={onReveal}/>;
            case Stages.owner:
                return <OwnerPanel/>;
        }
    }

    return (
        <>
            <Header/>
            <WithLoader pred={loading}>
                <Grid container className={style.content} alignContent={"center"} alignItems="center">
                    <Grid item xs={12}>
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