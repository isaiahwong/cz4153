import React, {useEffect, useState} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {Box, Grid, Typography} from "@mui/material";
import {ethers} from "ethers";

import Header from "../../components/header/Header";
import {dnsContract} from "../../api/dns/dns";
import {useWallet} from "../../api/wallet/wallet";
import {WithConnect, WithLoader} from "../../components/hoc/hoc";

import CommitmentStore, {Commitment} from "../../store/commits";
import PrecommitmentStore from "../../store/precommits";

import {randomSecret, timeDiffFromBlock, tryAlert} from "../../common/common";
import {TypedContractEvent, TypedEventLog,} from "../../api/typechain-types/common";
import {DomainBidFailedEvent, DomainRegisteredEvent,} from "../../api/typechain-types/contracts/registrar/Registrar";
import ViewOnlyPanel from "../../components/panels/ViewOnlyPanel";
import BidPanel, {CommitStages} from "../../components/panels/BidPanel";
import RevealPanel from "../../components/panels/RevealPanel";
import WaitPanel from "../../components/panels/WaitPanel";
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
    owner,
}

export default function Domain() {
    // Params
    const {domain: fqdn} = useParams();

    // State
    const [domain, setDomain] = useState<string>("");
    const [tld, setTLD] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [txLoading, setTxLoading] = useState(false);
    const [bid, setBid] = useState(0.003);
    const [stage, setStage] = useState<Stages>(Stages.commit);
    const [submittedCommitments, setSubmittedCommitments] =
        useState<Commitment[]>([]);
    const [precommitment, setPrecommitment] = useState<Commitment | null>(null);
    const [commitStages, setCommitStages] = useState<CommitStages | undefined>(undefined);

    const [owner, setOwner] = useState<string | null>(null);
    const [refund, setRefund] = useState<string>("0");
    const [highestBid, setHighestBid] = useState<string>("0");

    const navigate = useNavigate();
    const {provider, signer, connect} = useWallet();

    // Initializations
    useEffect(() => {
        if (!fqdn) return;

        // Ensure domain is valid
        const tld = fqdn!.split(".").pop();
        dnsContract.isValidTLD(provider, tld!).then(async (valid) => {
            if (!valid) {
                setTimeout(() => navigate(routes.notFound), 1000);
                return;
            }
            const domain = fqdn!.replace(`.${tld}`, "");

            // Attempt to connect
            await connect();
            setTLD(tld!);
            setDomain(domain);
            // dnsContract.onRegisteredDomains(provider, tld!, subdomain, onDomainRegistered);
        });
    }, []);

    useEffect(() => {
        if (stage !== Stages.reveal) return;
        const listeners = setInterval(async () => {
            const registeredEvents = await dnsContract.getDomainRegistered(
                provider,
                tld!,
                undefined,
                domain!
            );
            const bidFailedEvents = await dnsContract.getDomainBidFailed(
                provider,
                tld!,
                domain!
            );

            await onDomainRegistered(registeredEvents);
            await onDomainRevealFailed(bidFailedEvents);
        }, 500);

        return () => clearInterval(listeners);
    }, [tld, domain, stage, submittedCommitments]);

    useEffect(() => {
        if (!signer || !tld || !domain) return;

        getStage().then((stage) => {
            setLoading(false);
            setStage(stage);
        });
    }, [signer, tld, domain]);

    // Get current Stage of bidding process
    const getStage = async () => {
        const isOwnerStage = async (domain: string, tld: string) => {
            const addr = await dnsContract.getAddr(provider, `${domain}.${tld}`);
            if (addr != dnsContract.EMPTY_ADDRESS) setOwner(addr);
            return addr !== dnsContract.EMPTY_ADDRESS;
        };

        const isPendingRevealStage = async (
            deadline: number,
            auctionTimeRemain: number,
            commitment: Commitment[]
        ) => {
            return deadline != 0 && auctionTimeRemain <= 0 && commitments.length == 0;
        };

        const isCommitStage = (commitment: Commitment[]) => {
            return commitments.length == 0;
        };

        const isRevealStage = (deadline: number, remain: number) => {
            return deadline != 0 && remain < 0 && commitments.length > 0;
        };

        if (!tld || !domain) return Stages.viewOnly;
        if (!signer) {
            return (await isOwnerStage(domain, tld)) ? Stages.owner : Stages.viewOnly;
        }

        const deadline = await dnsContract.getAuctionDeadline(
            provider,
            tld,
            domain
        );
        const auctionTimeRemain = await timeDiffFromBlock(
            provider,
            Number(deadline)
        );
        const precommitment = await PrecommitmentStore.getCommitment(
            signer.address,
            tld,
            domain
        );
        const commitments = await CommitmentStore.getCommitments(
            signer.address,
            tld,
            domain
        );

        setSubmittedCommitments(commitments);
        setPrecommitment(precommitment);
        setCommitStages(precommitment ? CommitStages.PRECOMMIT : undefined)

        if (await isOwnerStage(domain, tld)) {
            return Stages.owner;
        } else if (isRevealStage(Number(deadline), auctionTimeRemain)) {
            return Stages.reveal;
        } else if (
            await isPendingRevealStage(
                Number(deadline),
                auctionTimeRemain,
                commitments
            )
        ) {
            return Stages.pendingReveal;
        } else if (isCommitStage(commitments)) {
            return Stages.commit;
        } else {
            return Stages.wait;
        }
    };

    const onRevealStage = () => {
        if (owner) return;
        setStage(Stages.reveal);
    };

    const onLostStage = (refund: string, highestBid: string) => {
        setStage(Stages.lose);
        setRefund(refund);
        setHighestBid(highestBid);
    };

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
    };

    const onDomainRegistered = async (
        events: Array<
            TypedEventLog<
                TypedContractEvent<
                    DomainRegisteredEvent.InputTuple,
                    DomainRegisteredEvent.OutputTuple,
                    DomainRegisteredEvent.OutputObject
                >
            >
        >
    ) => {
        const event = events.find((event) => {
            if (!event.args) return false;

            // if domain has expired, we ignore
            if (event.args.expires < BigInt(Math.round(Date.now() / 1000))) return;
            return true;
        });

        if (!signer || !event) return;

        if (submittedCommitments.length > 0) return;

        await CommitmentStore.deleteHighestCommitment(
            signer.address,
            tld,
            domain
        );
        await onOwnerStage();
    };

    const onDomainRevealFailed = async (
        events: Array<
            TypedEventLog<
                TypedContractEvent<
                    DomainBidFailedEvent.InputTuple,
                    DomainBidFailedEvent.OutputTuple,
                    DomainBidFailedEvent.OutputObject
                >
            >
        >
    ) => {
        const event = events.find((event) => {
            if (!event.args) return false;

            // if domain has expired, we ignore
            if (event.args.expires < BigInt(Math.round(Date.now() / 1000))) return;
            return true;
        });

        if (!signer || !event) return;

        const highestCommitment = await CommitmentStore.getHighestCommitment(
            signer.address,
            tld,
            domain
        );
        if (!highestCommitment) return;

        // Verify if user has revealed
        if (submittedCommitments.length > 0) return;

        const commitmentHash = await dnsContract.makeCommitment(
            provider,
            signer,
            highestCommitment.secret,
            highestCommitment.tld,
            highestCommitment.domain,
            highestCommitment.value
        );
        if (commitmentHash !== event.args.highestCommitment) {
            // Handle fail bid
            onLostStage(
                ethers.formatEther(event.args.refund),
                ethers.formatEther(event.args.highestBid)
            );
        }

        await CommitmentStore.deleteHighestCommitment(
            signer.address,
            tld,
            domain
        );
    };

    const onBidChange = (e: any) => {
        setBid(e.target.value);
    };

    const onCommit = async () => {
        if (!signer) {
            await connect();
            return;
        }

        if (bid < 0.003) return;

        const newCommitment = {
            owner: signer?.address!,
            tld: tld!,
            domain: domain!,
            secret: randomSecret(),
            value: bid.toString(),
            timestamp: Math.round(Date.now() / 1000),
        };

        try {
            setTxLoading(true);
            let commitment = precommitment;

            if (!commitment) {
                const tx = await dnsContract.precommit(
                    provider,
                    signer,
                    newCommitment.secret,
                    tld!,
                    domain!,
                    newCommitment.value
                );
                commitment = newCommitment;
                await PrecommitmentStore.addCommit(newCommitment);
                await tx.wait();
                setCommitStages(CommitStages.PRECOMMIT);
            }

            const tx = await dnsContract.commit(
                provider,
                signer,
                commitment.secret,
                tld!,
                domain!
            );

            await CommitmentStore.addCommit(commitment);
            await CommitmentStore.storeHighestCommitment(signer.address, tld, domain);
            await PrecommitmentStore.deleteCommitment(commitment.owner, commitment.tld, commitment.domain);
            await tx.wait();

            setPrecommitment(null);
            setSubmittedCommitments([...submittedCommitments, commitment]);
            setStage(Stages.wait);
            setCommitStages(undefined);
        } catch (e) {
            tryAlert(e);
            // check if precommitment exist
            const precommitment = await PrecommitmentStore.getCommitment(newCommitment.owner, newCommitment.tld, newCommitment.domain);
            if (precommitment) {
                setPrecommitment(precommitment);
                setCommitStages(precommitment ? CommitStages.PRECOMMIT : undefined)
            }
        }
        setTxLoading(false);
    };

    // Callback for reveal bid
    const onReveal = async () => {
        if (!signer) {
            await connect();
            return;
        }

        if (submittedCommitments.length == 0) return;
        try {
            setTxLoading(true);
            const tx =
                submittedCommitments.length == 1
                    ? await dnsContract.reveal(
                        provider,
                        signer,
                        submittedCommitments[0].secret,
                        tld,
                        domain,
                        submittedCommitments[0].value
                    )
                    : await dnsContract.batchReveal(
                        provider,
                        signer,
                        submittedCommitments
                    );
            await CommitmentStore.deleteCommitment(signer.address, tld, domain);
            await tx.wait();
            setSubmittedCommitments([]);
            setPrecommitment(null);
        } catch (e) {
            tryAlert(e);
        }
        setTxLoading(false);
    };

    const renderStage = () => {
        switch (stage) {
            case Stages.viewOnly:
                return <ViewOnlyPanel/>;
            case Stages.commit:
                return (
                    <BidPanel
                        loading={txLoading}
                        precommitment={precommitment ? precommitment : undefined}
                        stages={commitStages}
                        bid={bid}
                        onBidChange={onBidChange}
                        onClick={onCommit}
                    />
                );
            case Stages.wait:
                return (
                    <WaitPanel
                        precommitment={precommitment ? precommitment : undefined}
                        stages={commitStages}
                        commitments={submittedCommitments}
                        onAuctionEnded={onRevealStage}
                        bid={bid}
                        txLoading={txLoading}
                        onBidChange={onBidChange}
                        onClick={onCommit}
                    />
                );
            case Stages.reveal:
                return (
                    <RevealPanel
                        loading={txLoading}
                        commitments={submittedCommitments}
                        onClick={onReveal}
                    />
                );
            case Stages.pendingReveal:
                return <PendingRevealPanel onOwner={onOwnerStage}/>;
            case Stages.lose:
                return (
                    <LostPanel
                        refund={refund}
                        highestBid={highestBid}
                        onNext={() => getStage().then(setStage)}
                    />
                );
            case Stages.owner:
                return <OwnerDomainPanel owner={owner!} tld={tld!} domain={domain!}/>;
        }
    };

    if (!fqdn) return <Navigate to={routes.notFound}/>;

    return (
        <>
            <Header/>
            <Grid
                container
                className={style.content}
                alignContent={"center"}
                alignItems="center"
            >
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
