import React, {useEffect, useState} from "react";
import _ from "lodash";
import {Link} from "react-router-dom";

import {Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@mui/material";

import {useWallet} from "../../api/wallet/wallet";
import {dnsContract} from "../../api/dns/dns";
import truncateAddress, {timeDiffFromBlock} from "../../common/common";
import {WithLoader} from "../hoc/hoc";
import {routes} from "../../routes/app/App";

interface OwnerPanelProps {
    owner: string;
    tld: string;
    domain: string;
}

export default function OwnerDomainPanel(props: OwnerPanelProps) {
    const {owner, tld, domain} = props;
    const {provider} = useWallet();
    const [loading, setLoading] = useState(true);
    const [expiry, setExpiry] = useState("");

    useEffect(() => {
        getExpiry();
    }, []);

    const getExpiry = async () => {
        const expiry = Number(await dnsContract.getExpiry(provider, tld, domain));
        if (await timeDiffFromBlock(provider, expiry) < 0) {
            setExpiry("Expired");
        } else {
            const date = new Date(expiry * 1000);
            setExpiry(date.toString());
        }
        setLoading(false);
    }


    return (
        <TableContainer>
            <WithLoader loading={loading}>
                <Table sx={{minWidth: 300}} aria-label="simple table">
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
                                <Typography variant={"body1"}>
                                    {_.toLower(domain)}
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
                                <Link to={routes.address(owner)} style={{textDecoration: "none"}}>
                                    <Typography fontWeight="bold">
                                        {truncateAddress(owner)}
                                    </Typography>
                                </Link>
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
                </Table>
            </WithLoader>
        </TableContainer>
    )
}