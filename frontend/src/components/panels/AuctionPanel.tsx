import {Auction, dnsContract} from "../../api/dns/dns";
import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {routes} from "../../routes/app/App";
import truncateAddress, {getBlockTime} from "../../common/common";
import React, {useEffect} from "react";
import {useWallet} from "../../api/wallet/wallet";
import LinearProgressWithLabel from "../common/LinearProgressWithLabel";
import {WithLoader} from "../hoc/hoc";

interface AuctionWithTime extends Auction {
    remain: number;
    progress: number;
}

export default function AuctionPanel() {
    const {provider} = useWallet();

    const [loading, setLoading] = React.useState(true);
    const [auctions, setAuctions] = React.useState<Auction[]>([]);
    const [now, setNow] = React.useState<number>(0);

    useEffect(() => {
        init();
        const interval = setInterval(() => fetchOngoingAuctions(), 1000)
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (now == 0) return;
        tick(now);
    }, [now]);

    const init = async () => {
        const now = await getBlockTime(provider);
        setNow(now);
        await fetchOngoingAuctions();
        setLoading(false);
    }

    const tick = (now: number) => {
        setTimeout(() => setNow(now + 1), 1000);
    }

    const fetchOngoingAuctions = async () => {
        const auctions = await dnsContract.getActiveAuctions(provider);
        setAuctions(auctions);
    }

    const withTime = (auction: Auction) => {
        let remain = auction.deadline - now;
        let progress = ((auction.duration - remain) / auction.duration) * 100;

        if (auction.deadline != 0 && remain < 0) {
            progress = 100
        }

        if (progress < 0) {
            progress = 0
        }

        if (remain < 0) {
            progress = 100
            remain = 0
        }

        return {
            ...auction,
            remain: remain,
            progress: progress
        }
    }

    if (auctions.length == 0) {
        return (
            <Typography variant={"h6"}>
                No ongoing auctions
            </Typography>
        );
    }

    return (
        <WithLoader loading={loading}>
            <TableContainer>
                <Table sx={{minWidth: 300}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Domain</TableCell>
                            <TableCell align="right">Remain</TableCell>
                            <TableCell align="right">Progress</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            auctions.map(withTime).map((auction, i) => (
                                    <TableRow key={i} sx={{'td, th': {border: 0}}}>
                                        <TableCell component="th" scope="row">
                                            <Link to={routes.domain(`${auction.domain}.${auction.tld}`)} style={{textDecoration: "none"}}>
                                                <Typography fontWeight={"bold"}>
                                                    {`${auction.domain}.${auction.tld}`}
                                                </Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right" scope="row">
                                            <Typography align="right" fontWeight={"bold"}>
                                                Auction ends in {auction.remain}s
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <LinearProgressWithLabel value={auction.progress}/>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </WithLoader>
    )
}