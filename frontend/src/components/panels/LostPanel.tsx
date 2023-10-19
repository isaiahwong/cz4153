import {Box, Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import style from "../../routes/domain/Domain.module.css";
import React, {useEffect} from "react";

interface LostPanelProps {
    onNext: () => void;
    refund: string;
    highestBid: string;
}

export default function LostPanel(props: LostPanelProps) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Box mb={3} textAlign={"center"}>
                        <Typography variant={"h6"} fontWeight={"bold"}>
                            You lost the bid. Highest bid was {props.highestBid} ETH.
                        </Typography>
                        <Typography variant={"body1"} fontWeight={"bold"}>
                            {props.refund} ETH has been refunded to your wallet.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        className={style.button}
                        onClick={props.onNext}
                    >
                        <Typography variant="body1" fontWeight="bold">
                            Continue
                        </Typography>
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}