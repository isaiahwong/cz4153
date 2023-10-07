import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import WalletButton from "./WalletButton";
import {Grid} from "@mui/material";

export default function Header() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" >
                <Grid justifyContent={"flex-start"}>
                    <WalletButton />
                </Grid>

            </AppBar>
        </Box>
    );
}
