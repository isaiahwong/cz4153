import React, {useEffect} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import truncateAddress from "../../common/common";
import {routes} from "../../routes/app/App";
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import style from "../../routes/address/Address.module.css";
import {useWallet} from "../../api/wallet/wallet";
import {Domain} from "../../api/dns/dns";


export interface DomainPanelProps {
    domains: Domain[];
    showOwner?: boolean;
}

export default function DomainPanel(props: DomainPanelProps) {
    const {domains} = props;
    const navigate = useNavigate();
    const {signer, connect} = useWallet();

    useEffect(() => {
        if (!signer) connect();
    }, []);

    if (!domains) {
        return (
            <>
                <Typography>
                    No domains registered
                </Typography>
            </>
        )
    }

    const onSendEther = (domain: string) => {
        navigate({
            pathname: routes.sendEther,
            search: createSearchParams({send: domain}).toString()
        });
    }

    const sendEther = (domain: Domain) => {
        if (!domain.owner || (signer && signer.address == domain.owner)) {
            return <></>
        }
        return (
            <Button
                variant="contained"
                className={style.button}
                onClick={() => onSendEther(`${domain.name}.${domain.tld}`)}
            >
                <Typography variant="body1" fontWeight="bold">
                    Send Ether
                </Typography>
            </Button>
        );
    }

    return (
        <TableContainer>
            <Table sx={{minWidth: 300}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Domain</TableCell>
                        <TableCell align="left">TLD</TableCell>
                        {props.showOwner && <TableCell align="right">Owner</TableCell>}
                        <TableCell align="right">Expires</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        domains.map((domain, i) => (
                            <TableRow key={i} sx={{'td, th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    <Typography fontWeight={"bold"}>
                                        {domain.name}
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography fontWeight={"bold"}>
                                        {domain.tld}
                                    </Typography>
                                </TableCell>
                                {
                                    props.showOwner && (
                                        <TableCell align="right">
                                            <Typography fontWeight={"bold"}>
                                                <Link to={routes.address(domain.owner)} style={{textDecoration: "none"}}>
                                                    {truncateAddress(domain.owner)}
                                                </Link>
                                            </Typography>
                                        </TableCell>
                                    )
                                }
                                <TableCell align="right">
                                    {(new Date(domain.expires * 1000)).toISOString().split('T')[0]}
                                </TableCell>
                                <TableCell align="right">
                                    {sendEther(domain)}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}