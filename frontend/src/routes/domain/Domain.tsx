import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Box, Grid, Typography} from '@mui/material';
import {ethers, JsonRpcSigner} from "ethers";

import Header from "../../components/header/Header";
import {dnsContract} from "../../api/contract/contract";
import {useWallet} from "../../api/wallet/wallet";
import {WithConnect, WithLoader} from "../../components/hoc/hoc";

import CommitmentStore, {Commitment} from "../../store/commits";

import style from "./Domain.module.css";
import {randomSecret, timeDiffFromBlock} from "../../common/common";
import {TypedContractEvent, TypedEventLog} from "../../api/typechain-types/common";
import {
    SubdomainBidFailedEvent,
    SubdomainRegisteredEvent
} from "../../api/typechain-types/contracts/registrar/Registrar";
import ViewOnlyPanel from "../../components/domain/ViewOnlyPanel";
import BidPanel from "../../components/domain/BidPanel";
import RevealPanel from "../../components/domain/RevealPanel";
import WaitPanel from '../../components/domain/WaitPanel';
import PendingRevealPanel from "../../components/domain/PendingRevealPanel";
import OwnerPanel from "../../components/domain/OwnerPanel";
import Button from "@mui/material/Button";

interface LostPanelProps {
    onNext: () => void;
    refund: string;
}

function LostPanel(props: LostPanelProps) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Box mb={3}>
                        <Typography variant={"body1"} fontWeight={"bold"}>
                            You lost the bid. {props.refund} ETH has been refunded to your wallet.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        className={style.button}
                        onClick={props.onNext}
                    >
                        <Typography variant="body1" fontWeight="bold">
                            Continue
                        </Typography>
                    </Button>
                </Box>
            </Grid>
        </Grid>
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
    const [refund, setRefund] = useState<string>("0");

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

        const isPendingRevealStage = async (deadline: number, auctionTimeRemain: number, commitment: Commitment | null) => {
            return (deadline != 0 && auctionTimeRemain <= 0) && !commitment;
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
        const auctionTimeRemain = await timeDiffFromBlock(provider, Number(deadline));
        const commitment = await CommitmentStore.getCommit(signer.address, tld, subdomain);
        setSubmittedCommitment(commitment);

        if (await isOwnerStage(subdomain, tld)) {
            return Stages.owner;
        } else if (await isPendingRevealStage(Number(deadline), auctionTimeRemain, commitment)) {
            return Stages.pendingReveal;
        } else if (isRevealStage(Number(deadline), auctionTimeRemain)) {
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

    const onLostStage = (refund: string) => {
        setStage(Stages.lose);
        setRefund(refund);
    }

    const onOwnerStage = async (signer: JsonRpcSigner) => {
        if (!signer || !subdomain || !tld) return;
        const addr = await dnsContract.getAddr(provider, `${subdomain}.${tld}`);
        if (addr !== dnsContract.EMPTY_ADDRESS) {
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

        await onOwnerStage(signer);
    }

    const onBidFailed = async (events: Array<TypedEventLog<TypedContractEvent<SubdomainBidFailedEvent.InputTuple, SubdomainBidFailedEvent.OutputTuple, SubdomainBidFailedEvent.OutputObject>>>) => {
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
        onLostStage(ethers.formatEther(event.args.refund));
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
                return <LostPanel refund={refund} onNext={() => getStage().then(setStage)}/>;
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