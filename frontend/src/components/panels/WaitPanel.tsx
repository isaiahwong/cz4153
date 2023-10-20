import React, {useEffect, useState} from 'react';
import {Commitment} from "../../store/commits";
import {useWallet} from "../../api/wallet/wallet";
import {Navigate} from "react-router-dom";
import {dnsContract} from "../../api/dns/dns";
import {
    Box,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import LinearProgressWithLabel from "../common/LinearProgressWithLabel";
import {WithPred} from "../hoc/hoc";
import {routes} from "../../routes/app/App";
import BidPanel from "./BidPanel";
import CommittedBidsPanel from "./CommittedBidsPanel";

export interface WaitPanelProps {
    commitments: Commitment[];
    onAuctionEnded: () => void;
    bid: number;
    onBidChange: (e: any) => void;
    onClick: () => void;
    txLoading?: boolean;
}

export default function WaitPanel(props: WaitPanelProps) {
    const {commitments, onAuctionEnded} = props;
    const {provider} = useWallet();
    const [progress, setProgress] = useState(0);
    const [remain, setRemain] = useState(0);
    const [deadline, setDeadline] = useState(0);
    useEffect(() => {
        if (!commitments) return;
        getBlockTime().then(getDeadline);
    }, []);

    if (commitments.length == 0) {
        return <Navigate to={routes.landing}/>;
    }

    const getBlockTime = async () => {
        return (await provider.getBlock("latest"))!.timestamp;
    }

    const getDeadline = async (now: number) => {
        if (commitments.length == 0) return;
        // Get first commitment in list
        const commitment = commitments[0];
        const deadline = Number(await dnsContract.getAuctionDeadline(provider, commitment.tld, commitment.domain));
        const duration = Number(await dnsContract.getAuctionDuration(provider, commitment.tld));

        let remain = deadline - now;
        setDeadline(deadline);

        // Deadline 0 means auction has not started yet
        if (deadline != 0 && remain < 0) {
            onAuctionEnded();
            return;
        }

        let progress = ((duration - remain) / duration) * 100;
        if (remain < 0 || remain > duration) {
            progress = 0
        }

        if (remain < 0) {
            remain = 0
        }

        setProgress(progress)
        setRemain(remain)
        setTimeout(() => getDeadline(now + 1), 1000);
    }

    if (commitments.length == 0) {
        return <Navigate to={routes.landing}/>;
    }
    return (
        <Grid container>
            <Grid item xs={12}>
                <WithPred pred={Number(deadline) == 0}>
                    <Typography fontWeight={"bold"}>
                        Pending Tx
                    </Typography>
                </WithPred>
                <WithPred pred={Number(deadline) != 0}>
                    <Typography fontWeight={"bold"}>
                        Auction ends in {remain}s
                    </Typography>
                </WithPred>
                <LinearProgressWithLabel value={progress}/>
                <Box mt={2} mb={2}>
                    <BidPanel loading={props.txLoading} bid={props.bid} onBidChange={props.onBidChange} onClick={props.onClick}/>
                </Box>
                <Divider/>
                <Box mt={2}>
                    <CommittedBidsPanel commitments={commitments}/>
                </Box>
            </Grid>
        </Grid>
    )
}