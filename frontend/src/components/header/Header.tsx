import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import WalletButton from "./WalletButton";
import {Toolbar, Typography} from "@mui/material";

import {Link} from "react-router-dom";
import style from "./Header.module.css";
import {routes} from "../../routes/app/App";

const linkStyle = {textDecoration: "none", color: "white"};

export default function Header() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar className={style.header} position="static">
                <Toolbar>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} width={"100%"}>
                        <Link to={"/"} style={linkStyle}>
                            <Typography
                                variant="h6"
                                component="div"
                                fontWeight={"bold"}
                            >
                                DNS
                            </Typography>
                        </Link>
                        <Box display={"flex"} alignItems={"center"}>
                            <Box mr={"20px"}>
                                <Typography fontWeight={"bold"}>
                                    <Link to={routes.auctions} style={linkStyle}>
                                        Auctions
                                    </Link>
                                </Typography>
                            </Box>
                            <Box mr={"20px"}>
                                <Typography fontWeight={"bold"}>
                                    <Link to={routes.domains} style={linkStyle}>
                                        All Domains
                                    </Link>
                                </Typography>
                            </Box>
                            <Box mr={"20px"}>
                                <Typography fontWeight={"bold"}>
                                    <Link to={routes.sendEther} style={linkStyle}>
                                        Send Ether
                                    </Link>
                                </Typography>
                            </Box>
                            <Box className={style.item}>
                                <WalletButton/>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
