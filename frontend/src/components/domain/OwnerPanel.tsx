import {useWallet} from "../../api/wallet/wallet";
import React, {useEffect, useState} from "react";
import {dnsContract} from "../../api/contract/contract";
import {timeDiffFromBlock} from "../../common/common";
import {Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@mui/material";
import {WithLoader} from "../hoc/hoc";
import _ from "lodash";

interface OwnerPanelProps {
    owner: string;
    tld: string;
    subdomain: string;
}

export default function OwnerPanel(props: OwnerPanelProps) {
    const {owner, tld, subdomain} = props;
    const {provider} = useWallet();
    const [loading, setLoading] = useState(true);
    const [expiry, setExpiry] = useState("");

    useEffect(() => {
        getExpiry();
    }, []);

    const getExpiry = async () => {
        const expiry = Number(await dnsContract.getExpiry(provider, tld, subdomain));
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