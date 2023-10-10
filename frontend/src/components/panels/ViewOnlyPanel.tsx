import {Box, Grid, Typography} from "@mui/material";

export default function ViewOnlyPanel() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Box>
                        <Typography variant={"h5"} fontWeight={"bold"}>
                            Connect your wallet to bid for this domain
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}