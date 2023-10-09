import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import WalletButton from "./WalletButton";
import {Toolbar, Typography} from "@mui/material";

import style from "./Header.module.css";
import {Link} from "react-router-dom";

export default function Header() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar className={style.header} position="static">
                <Toolbar>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} width={"100%"}>
                        <Link to={"/"} style={{textDecoration: "none", color: "white"}}>
                            <Typography
                                variant="h6"
                                component="div"
                            >
                                DNS
                            </Typography>
                        </Link>
                        <Box >
                            <WalletButton/>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
