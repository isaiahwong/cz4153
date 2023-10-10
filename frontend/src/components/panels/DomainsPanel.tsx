import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {WithLoader} from "../hoc/hoc";
import _ from "lodash";
import {Link} from "react-router-dom";
import {routes} from "../../routes/app/App";
import truncateAddress from "../../common/common";
import React from "react";


export interface Domain {
    name: string;
    tld: string;
    expires: number;
}

export interface DomainPanelProps {
    domains: Domain[];
}

export default function DomainPanel(props: DomainPanelProps) {
    const {domains} = props;

    if (!domains) {
        return (
            <>
                <Typography>
                    No domains registered
                </Typography>
            </>
        )
    }

    return (
        <TableContainer>
            <Table sx={{minWidth: 300}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Domains</TableCell>
                        <TableCell align="left">TLD</TableCell>
                        <TableCell align="right">Expires</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {domains.map((domain) => (
                        <TableRow sx={{'td, th': {border: 0}}}>
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
                            <TableCell align="right">
                                {(new Date(domain.expires * 1000)).toString()}
                            </TableCell>
                        </TableRow>   
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}