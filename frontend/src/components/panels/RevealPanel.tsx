import React from "react";
import {Commitment} from "../../store/commits";
import {Box, CircularProgress, Grid, Typography} from "@mui/material";
import {WithLoader, WithPred} from "../hoc/hoc";
import Button from "@mui/material/Button";
import style from "../../routes/domain/Domain.module.css";
import CommittedBidsPanel from "./CommittedBidsPanel";
import LoadingButton from "@mui/lab/LoadingButton";

interface RevealPanelProps {
    onClick: () => void;
    commitments: Commitment[];
    loading?: boolean;
}

export default function RevealPanel(props: RevealPanelProps) {
    const {onClick, loading, commitments} = props;
    const revealText = commitments.length == 1 ? "Reveal" : "Batch Reveal";
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <WithPred pred={commitments.length == 0}>
                        <Box mb={3}>
                            <Typography variant={"body1"} fontWeight={"bold"}>
                                Pending tx
                            </Typography>
                        </Box>
                    </WithPred>
                    <WithLoader loading={commitments.length == 0}>
                        <CommittedBidsPanel commitments={commitments}/>
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            onClick={onClick}
                            loadingIndicator={<CircularProgress style={{color: "white"}} size={16}/>}
                            style={{ borderRadius: "20px", backgroundColor: "#5105FF"}}
                        >
                            <Typography variant="body1" fontWeight="bold">
                                {revealText}
                            </Typography>
                        </LoadingButton>
                    </WithLoader>
                </Box>
            </Grid>
        </Grid>
    )
}