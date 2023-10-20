import {Commitment} from "../../store/commits";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React from "react";

interface CommittedDomainsProps {
    commitments: Commitment[];
}

export default function CommittedBidsPanel(props: CommittedDomainsProps) {
    const {commitments} = props;
    return (
        <TableContainer>
            <Typography variant={"h6"} >
                Submitted Bids
            </Typography>
            <Table sx={{minWidth: 300}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="right">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {commitments.map((commitment, i) => (
                        <TableRow key={i} sx={{'td, th': {border: 0}}}>
                            <TableCell component="th" scope="row">
                                <Typography fontWeight={"bold"}>
                                    {i + 1}
                                </Typography>
                            </TableCell>
                            <TableCell  align="right" component="th" scope="row">
                                <Typography fontWeight={"bold"}>
                                    {commitment.value} ETH
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}