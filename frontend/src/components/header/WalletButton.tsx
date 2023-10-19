import React, {useEffect} from "react";
import Button from "@mui/material/Button";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import _ from 'lodash';

import {useWallet} from "../../api/wallet/wallet";
import truncateAddress from "../../common/common";
import { Link } from "react-router-dom";
import {routes} from "../../routes/app/App";
import style from "./WalletButton.module.css";


export default function WalletButton() {
    const normalizeNetworkName = (name: string) => {
        if (name.toLowerCase() === "unknown") return "Localhost";
        return name;
    }
    const {signer, network, connect} = useWallet();
    const title = `${normalizeNetworkName(_.capitalize(network?.name))} (${truncateAddress(signer?.address)})`;
    const connected = signer !== undefined;

    useEffect(() => {
        if (!signer) {
            connect();
        }
    }, []);

    const connectedButton = (
        <Grid alignContent={"flex-start"}>
            <Grid item xs={12}>
                <Link to={routes.address(signer?.address)} className={style.header}>
                    <Typography fontSize={14} component="div" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>
                </Link>
            </Grid>
        </Grid>

    );

    const disconnectedButton = <Button color="inherit" onClick={connect}>Connect</Button>;
    const button = connected ? connectedButton : disconnectedButton;

    return (
        <div className={style.wallet_wrapper}>
            {button}
        </div>
    );
}
