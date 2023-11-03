import {Box, CircularProgress, TextField, Typography} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import style from "../../routes/domain/Domain.module.css";
import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {WithPred} from "../hoc/hoc";
import {Commitment} from "../../store/commits";

export enum CommitStages {
    PRECOMMIT = 0,
    COMMIT = 1,
}

interface BidPanelProps {
    bid: number;
    onBidChange: (e: any) => void;
    onClick: () => void;
    loading?: boolean;
    precommitment?: Commitment;
    stages?: CommitStages;
}

export default function BidPanel(props: BidPanelProps) {
    const {bid, stages, onBidChange, loading, precommitment} = props;

    const text = precommitment ? "START AUCTION" : "COMMIT";

    return (
        <Box textAlign={"right"} width={"100%"}>
            <WithPred pred={!precommitment}>
                <TextField
                    className={style.field}
                    type="number"
                    label="Enter Bid"
                    defaultValue={0.003}
                    onChange={onBidChange}
                    error={bid < 0.003}
                    helperText={bid < 0.003 ? "Bid must be at least 0.003 ETH" : ""}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </WithPred>

            <Box mt={4}>
                <Typography variant="body1" fontWeight="bold" textAlign={"left"}>
                    The commit phase requires you to submit two transactions.
                </Typography>
                <Box mt={2} style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    color:  stages == CommitStages.PRECOMMIT || stages == CommitStages.COMMIT ? "#1bb66d" : "black",
                }}>
                    <CheckCircleOutlineIcon />
                    <Typography variant="body1" fontWeight="bold" textAlign={"left"}>
                        1. Submission of an anonymous commitment to the contract.
                    </Typography>
                </Box>
                <Box style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    color:  stages == CommitStages.COMMIT ? "#1bb66d" : "black",
                }}>
                    <CheckCircleOutlineIcon />
                    <Typography variant="body1" fontWeight="bold" textAlign={"left"}>
                        2. Starting the auction.
                    </Typography>
                </Box>
            </Box>

            <WithPred pred={!!precommitment}>
                <Typography variant="body1" fontWeight="bold" textAlign={"center"} mt={5}>
                    Start your auction bid of now {precommitment?.value} ETH
                </Typography>
            </WithPred>

            <Box mt={2} style={{textAlign: "center"}}>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    onClick={props.onClick}
                    loadingIndicator={<CircularProgress style={{color: "white"}} size={16}/>}
                    style={{minWidth: "140px", maxWidth: "200px", borderRadius: "20px", backgroundColor: "#5105FF"}}
                >
                    <Typography variant="body1" fontWeight="bold">
                        {text}
                    </Typography>
                </LoadingButton>
            </Box>
        </Box>
    )
}