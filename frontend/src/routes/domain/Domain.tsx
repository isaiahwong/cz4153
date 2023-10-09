import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import {Box, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography} from '@mui/material';
import {JsonRpcSigner} from "ethers";

import _ from 'lodash';
import Header from "../../components/header/Header";
import {dnsContract} from "../../api/contract/contract";
import {useWallet} from "../../api/wallet/wallet";
import {Loader, WithConnect, WithLoader} from "../../components/hoc/hoc";

import CommitmentStore, {Commitment} from "../../store/commits";

import style from "./Domain.module.css";
import {randomSecret, timeDiffNowSec} from "../../common/common";
import LinearProgressWithLabel from "../../components/common/LinearProgressWithLabel";
import {TypedContractEvent, TypedEventLog} from "../../api/typechain-types/common";
import {SubdomainRegisteredEvent} from "../../api/typechain-types/contracts/registrar/Registrar";

interface BidPanelProps {
    bid: number;
    onBidChange: (e: any) => void;
    onClick: () => void;
}

function ViewOnlyPanel() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Box>
                        <Typography variant={"h5"} fontWeight={"bold"}>
                            Connect your wallet to bid for this domain
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

function PendingRevealPanel() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Box mb={3}>
                        <Typography variant={"h5"} fontWeight={"bold"}>
                            Waiting for reveal
                        </Typography>
                    </Box>
                    <Loader />
                </Box>
            </Grid>
        </Grid>
    )
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
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!commitment) return;
        getDeadline();
    }, []);

    if (!commitment) {
        return <Navigate to={'/'}/>;
    }

    const getDeadline = async () => {
        const deadline = await dnsContract.getAuctionDeadline(provider, commitment.tld, commitment.subdomain);
        const duration = await dnsContract.getAuctionDuration(provider, commitment.tld);
        let remain = timeDiffNowSec(Number(deadline));

        // Deadline 0 means auction has not started yet
        if (Number(deadline) != 0 && remain < 0) {
            onAuctionEnded();
            return;
        }
        if (remain < 0 || remain > Number(duration)) {
            remain = Number(duration);
        }

        setProgress(((Number(duration) - remain) / Number(duration)) * 100)
        setTimeout(getDeadline, 100);
    }

    if (!commitment) {
        return <Navigate to={'/'}/>;
    }
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography fontWeight={"bold"}>
                    Waiting for bid auction to end
                </Typography>
                <LinearProgressWithLabel value={progress}/>
            </Grid>
        </Grid>
    )
}

interface RevealPanelProps {
    onClick: () => void;
    commitment: Commitment | null;
}

function RevealPanel(props: RevealPanelProps) {
    const {onClick, commitment} = props;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"center"}>
                    <WithLoader pred={!commitment}>
                        <Button
                            variant="contained"
                            className={style.button}
                            onClick={onClick}
                        >
                            <Typography variant="body1" fontWeight="bold">
                                Reveal
                            </Typography>
                        </Button>
                    </WithLoader>
                </Box>
            </Grid>
        </Grid>
    )
}

interface OwnerPanelProps {
    owner: string;
    tld: string;
    subdomain: string;
}

function OwnerPanel(props: OwnerPanelProps) {
    const {owner, tld, subdomain} = props;
    const {provider} = useWallet();
    const [loading, setLoading] = useState(true);
    const [expiry, setExpiry] = useState("");

    useEffect(() => {
        getExpiry();
    }, []);

    const getExpiry = async () => {
        const expiry = Number(await dnsContract.getExpiry(provider, tld, subdomain));
        if (timeDiffNowSec(expiry) < 0) {
            setExpiry("Expired");
        } else {
            const date = new Date(expiry * 1000);
            setExpiry(date.toString());
        }
        setLoading(false);
    }


    return (
        <TableContainer>
            <Table sx={{minWidth: 300}} aria-label="simple table">
                <WithLoader pred={loading}>
                    <TableBody>
                        <TableRow sx={{'td, th': {border: 0}}}>
                            <TableCell component="th" scope="row">
                                <Typography fontWeight={"bold"}>
                                    TLD
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                {_.toUpper(tld)}
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{'td, th': {border: 0}}}>
                            <TableCell component="th" scope="row">
                                <Typography fontWeight={"bold"}>
                                    Domain
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant={"body1"} >
                                    {_.toLower(subdomain)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{'td, th': {border: 0}}}>
                            <TableCell component="th" scope="row">
                                <Typography fontWeight={"bold"}>
                                    Address
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                {owner}
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{'td, th': {border: 0}}}>
                            <TableCell component="th" scope="row">
                                <Typography fontWeight={"bold"}>
                                    Expiry
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                {expiry}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </WithLoader>
            </Table>
        </TableContainer>
    )
}

function LosePanel() {
    return (
        <>
            <div>
                You lost the bid
            </div>
        </>
    )
}

enum Stages {
    viewOnly,
    commit,
    wait,
    reveal,
    pendingReveal,
    lose,
    owner
}

export default function Domain() {
    const {domain} = useParams();
    const [subdomain, setSubdomain] = useState<string>("");
    const [tld, setTLD] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [bid, setBid] = useState(0.003);
    const [stage, setStage] = useState<Stages>(Stages.commit);
    const [submittedCommitment, setSubmittedCommitment] = useState<Commitment | null>(null);
    const [owner, setOwner] = useState<string | null>(null);

    const navigate = useNavigate();
    const {provider, signer, connect} = useWallet();

    if (!domain) {
        navigate('/');
    }

    // Initializations
    useEffect(() => {
        // Ensure domain is valid
        const tld = domain!.split('.').pop();
        dnsContract.isValidTLD(provider, tld!).then(async (valid) => {
            if (!valid) navigate('/');
            const subdomain = domain!.replace(`.${tld}`, '');

            // Attempt to connect
            await connect();

            setTLD(tld!);
            setSubdomain(subdomain);
            // dnsContract.onRegisteredDomains(provider, tld!, subdomain, onDomainRegistered);
        })
    }, []);

    useEffect(() => {
        if (stage !== Stages.reveal) return;
        const listeners = setInterval(async () => {
            const registeredEvents = await dnsContract.querySubdomainRegistered(provider, tld!, subdomain!);
            const bidFailedEvents = await dnsContract.querySubdomainBidFailed(provider, tld!, subdomain!);
            await onDomainRegistered(registeredEvents);
            await onBidFailed(bidFailedEvents);
        }, 500);

        return () => clearInterval(listeners);
    }, [tld, subdomain, stage]);

    useEffect(() => {
        if (!signer || !tld || !subdomain) return;

        getStage().then((stage) => {
            setLoading(false);
            setStage(stage);
        });
    }, [signer, tld, subdomain]);

    const getStage = async () => {
        const isOwnerStage = async (subdomain: string, tld: string) => {
            const addr = await dnsContract.getAddr(provider, `${subdomain}.${tld}`);
            if (addr != dnsContract.EMPTY_ADDRESS) setOwner(addr);
            return addr !== dnsContract.EMPTY_ADDRESS;
        }

        const isPendingRevealStage = async (deadline: number, remain: number, commitment: Commitment | null) => {
            return (deadline != 0 && remain <= 0) && !commitment;
        }

        const isCommitStage = (commitment: Commitment | null) => {
            return !commitment;
        }

        const isRevealStage = (deadline: number, remain: number) => {
            return deadline != 0 && remain < 0
        }

        if (!tld || !subdomain) return Stages.viewOnly;
        if (!signer) {
            return (await isOwnerStage(subdomain, tld)) ? Stages.owner : Stages.viewOnly;
        }

        const deadline = await dnsContract.getAuctionDeadline(provider, tld, subdomain);
        const remain = timeDiffNowSec(Number(deadline));
        const commitment = await CommitmentStore.getCommit(signer.address, tld, subdomain);
        setSubmittedCommitment(commitment);

        if (await isOwnerStage(subdomain, tld)) {
            return Stages.owner;
        } else if (await isPendingRevealStage(Number(deadline), remain, commitment)) {
            return Stages.pendingReveal;
        } else if (isRevealStage(Number(deadline), remain)) {
            return Stages.reveal;
        } else if (isCommitStage(commitment)) {
            return Stages.commit;
        } else {
            return Stages.wait;
        }
    }

    const onRevealStage = () => {
        if (owner) return;
        setStage(Stages.reveal);
    }

    const onLostStage = () => {
        setStage(Stages.lose);
    }

    const onOwnerStage = async (signer: JsonRpcSigner) => {
        if (!signer || !subdomain || !tld) return;
        const addr = await dnsContract.getAddr(provider, `${subdomain}.${tld}`);
        if (addr === signer.address) {
            setStage(Stages.owner);
            setOwner(addr);
            return;
        }

        setTimeout(() => {
            onOwnerStage(signer);
        }, 100);
    }

    const onDomainRegistered = async (events: Array<TypedEventLog<TypedContractEvent<SubdomainRegisteredEvent.InputTuple, SubdomainRegisteredEvent.OutputTuple, SubdomainRegisteredEvent.OutputObject>>>) => {
        const event = events.find((event) => {
            if (!event.args) return false;

            // if domain has expired, we ignore
            if (event.args.expires < BigInt(Math.round(Date.now() / 1000))) return;
            return true;
        });

        if (!signer || !event) return;

        if (signer.address !== event.args.owner) {
            return;
        }

        // Handle success bid
        await onOwnerStage(signer);
    }

    const onBidFailed = async (events: Array<TypedEventLog<TypedContractEvent<SubdomainRegisteredEvent.InputTuple, SubdomainRegisteredEvent.OutputTuple, SubdomainRegisteredEvent.OutputObject>>>) => {
        const event = events.find((event) => {
            if (!event.args) return false;

            // if domain has expired, we ignore
            if (event.args.expires < BigInt(Math.round(Date.now() / 1000))) return;
            return true;
        });

        if (!signer || !event) return;

        if (signer.address !== event.args.owner) {
            return;
        }

        // Handle fail bid
        onLostStage();
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
        setStage(Stages.wait);
    }

    const onReveal = async () => {
        if (!signer) {
            await connect();
            return;
        }

        if (!submittedCommitment) return;
        await dnsContract.reveal(provider, signer, submittedCommitment.secret, tld!, subdomain!, submittedCommitment.value)
        await CommitmentStore.deleteCommit(submittedCommitment);
        setSubmittedCommitment(null);
    }

    const processStage = () => {
        switch (stage) {
            case Stages.viewOnly:
                return <ViewOnlyPanel/>;
            case Stages.commit:
                return <BidPanel bid={bid} onBidChange={onBidChange} onClick={onCommit}/>;
            case Stages.wait:
                return <WaitPanel commitment={submittedCommitment} onAuctionEnded={onRevealStage}/>;
            case Stages.reveal:
                return <RevealPanel commitment={submittedCommitment} onClick={onReveal}/>;
            case Stages.pendingReveal:
                return <PendingRevealPanel/>;
            case Stages.lose:
                return <LosePanel/>;
            case Stages.owner:
                return <OwnerPanel owner={owner!} tld={tld!} subdomain={subdomain!}/>;
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