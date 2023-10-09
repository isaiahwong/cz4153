import {Box, Grid, Typography} from "@mui/material";
import {Loader} from "../hoc/hoc";
import React from "react";

export default function PendingRevealPanel() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Box mb={3}>
                        <Typography variant={"h5"} fontWeight={"bold"}>
                            Waiting for reveal
                        </Typography>
                    </Box>
                    <Loader />
                </Box>
            </Grid>
        </Grid>
    )
}
