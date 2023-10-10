import React from "react";
import {Commitment} from "../../store/commits";
import {Box, Grid, Typography} from "@mui/material";
import {WithLoader, WithPred} from "../hoc/hoc";
import Button from "@mui/material/Button";
import style from "../../routes/domain/Domain.module.css";

interface RevealPanelProps {
    onClick: () => void;
    commitment: Commitment | null;
}

export default function RevealPanel(props: RevealPanelProps) {
    const {onClick, commitment} = props;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <WithPred pred={!commitment}>
                        <Box mb={3}>
                            <Typography variant={"body1"} fontWeight={"bold"}>
                                Pending tx
                            </Typography>
                        </Box>
                    </WithPred>
                    <WithLoader loading={!commitment}>
                        <Button
                            variant="contained"
                            className={style.button}
                            onClick={onClick}
                        >
                            <Typography variant="body1" fontWeight="bold">
                                Reveal
                            </Typography>
                        </Button>
                    </WithLoader>
                </Box>
            </Grid>
        </Grid>
    )
}