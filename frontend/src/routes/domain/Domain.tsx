import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {Box, Grid, Typography} from '@mui/material';
import {ethers} from "ethers";

import Header from "../../components/header/Header";
import {dnsContract} from "../../api/dns/dns";
import {useWallet} from "../../api/wallet/wallet";
import {WithConnect, WithLoader} from "../../components/hoc/hoc";

import CommitmentStore, {Commitment} from "../../store/commits";

import {randomSecret, timeDiffFromBlock} from "../../common/common";
import {TypedContractEvent, TypedEventLog} from "../../api/typechain-types/common";
import {DomainBidFailedEvent, DomainRegisteredEvent} from "../../api/typechain-types/contracts/registrar/Registrar";
import ViewOnlyPanel from "../../components/panels/ViewOnlyPanel";
import BidPanel from "../../components/panels/BidPanel";
import RevealPanel from "../../components/panels/RevealPanel";
import WaitPanel from '../../components/panels/WaitPanel';
import PendingRevealPanel from "../../components/panels/PendingRevealPanel";
import OwnerDomainPanel from "../../components/panels/OwnerDomainPanel";
import LostPanel from "../../components/panels/LostPanel";
import {routes} from "../app/App";

import style from "./Domain.module.css";

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
    // Params
    const {domain: fqdn } = useParams();

    // State
    const [domain, setDomain] = useState<string>("");
    const [tld, setTLD] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [bid, setBid] = useState(0.003);
    const [stage, setStage] = useState<Stages>(Stages.commit);
    const [submittedCommitment, setSubmittedCommitment] = useState<Commitment | null>(null);
    const [owner, setOwner] = useState<string | null>(null);
    const [refund, setRefund] = useState<string>("0");
    const [highestBid, setHighestBid] = useState<string>("0");

    const navigate = useNavigate();
    const {provider, signer, connect} = useWallet();


    // Initializations
    useEffect(() => {
        if (!fqdn) return;

        // Ensure domain is valid
        const tld = fqdn!.split('.').pop();
        dnsContract.isValidTLD(provider, tld!).then(async (valid) => {
            if (!valid) {
                setTimeout(() => navigate(routes.notFound), 1000);
                return;
            }
            const domain = fqdn!.replace(`.${tld}`, '');

            // Attempt to connect
            await connect();

            setTLD(tld!);
            setDomain(domain);
            // dnsContract.onRegisteredDomains(provider, tld!, subdomain, onDomainRegistered);
        })
    }, []);

    useEffect(() => {
        if (stage !== Stages.reveal) return;
        const listeners = setInterval(async () => {
            const registeredEvents = await dnsContract.getDomainRegistered(provider, tld!, undefined, domain!);
            const bidFailedEvents = await dnsContract.getDomainBidFailed(provider, tld!, domain!);
            await onDomainRegistered(registeredEvents);
            await onDomainRevealFailed(bidFailedEvents);
        }, 500);

        return () => clearInterval(listeners);
    }, [tld, domain, stage]);

    useEffect(() => {
        if (!signer || !tld || !domain) return;

        getStage().then((stage) => {
            setLoading(false);
            setStage(stage);
        });
    }, [signer, tld, domain]);

    const getStage = async () => {
        const isOwnerStage = async (domain: string, tld: string) => {
            const addr = await dnsContract.getAddr(provider, `${domain}.${tld}`);
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

        if (!tld || !domain) return Stages.viewOnly;
        if (!signer) {
            return (await isOwnerStage(domain, tld)) ? Stages.owner : Stages.viewOnly;
        }

        const deadline = await dnsContract.getAuctionDeadline(provider, tld, domain);
        const auctionTimeRemain = await timeDiffFromBlock(provider, Number(deadline));
        const commitment = await CommitmentStore.getCommit(signer.address, tld, domain);
        setSubmittedCommitment(commitment);

        if (await isOwnerStage(domain, tld)) {
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

    const onLostStage = (refund: string, highestBid: string) => {
        setStage(Stages.lose);
        setRefund(refund);
        setHighestBid(highestBid);
    }

    const onOwnerStage = async () => {
        if (!domain || !tld) return;
        const addr = await dnsContract.getAddr(provider, `${domain}.${tld}`);
        if (addr !== dnsContract.EMPTY_ADDRESS) {
            setStage(Stages.owner);
            setOwner(addr);
            return;
        }

        setTimeout(() => {
            onOwnerStage();
        }, 100);
    }

    const onDomainRegistered = async (events: Array<TypedEventLog<TypedContractEvent<DomainRegisteredEvent.InputTuple, DomainRegisteredEvent.OutputTuple, DomainRegisteredEvent.OutputObject>>>) => {
        const event = events.find((event) => {
            if (!event.args) return false;

            // if domain has expired, we ignore
            if (event.args.expires < BigInt(Math.round(Date.now() / 1000))) return;
            return true;
        });

        if (!signer || !event) return;

        await onOwnerStage();
    }

    const onDomainRevealFailed = async (events: Array<TypedEventLog<TypedContractEvent<DomainBidFailedEvent.InputTuple, DomainBidFailedEvent.OutputTuple, DomainBidFailedEvent.OutputObject>>>) => {
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
        onLostStage(ethers.formatEther(event.args.refund), ethers.formatEther(event.args.highestBid));
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
            domain: domain!,
            secret: randomSecret(),
            value: bid.toString()
        }

        await dnsContract.commit(provider, signer, commitment.secret, tld!, domain!, commitment.value)
        await CommitmentStore.addCommit(commitment);
        setSubmittedCommitment(commitment);
        setStage(Stages.wait);
    }

    // Callback for reveal bid
    const onReveal = async () => {
        if (!signer) {
            await connect();
            return;
        }

        if (!submittedCommitment) return;
        await dnsContract.reveal(provider, signer, submittedCommitment.secret, tld!, domain!, submittedCommitment.value)
        await CommitmentStore.deleteCommit(submittedCommitment);
        setSubmittedCommitment(null);
    }

    const renderStage = () => {
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
                return <PendingRevealPanel onOwner={onOwnerStage}/>;
            case Stages.lose:
                return <LostPanel refund={refund} highestBid={highestBid} onNext={() => getStage().then(setStage)}/>;
            case Stages.owner:
                return <OwnerDomainPanel owner={owner!} tld={tld!} domain={domain!}/>;
        }
    }

    if (!fqdn) <Navigate to={routes.notFound}/>;


    return (
        <>
            <Header/>
            <Grid container className={style.content} alignContent={"center"} alignItems="center">
                <Grid item xs={12}>
                    <Box className={style.wrapper}>
                        <Typography variant="h5" fontWeight="bold">
                            {fqdn}
                        </Typography>
                        <Box
                            className={style.panel}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <WithLoader loading={loading}>
                                <WithConnect onClick={() => connect()} pred={!!signer}>
                                    {renderStage()}
                                </WithConnect>
                            </WithLoader>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}