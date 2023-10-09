import React, {useEffect} from "react";
import Button from "@mui/material/Button";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import _ from 'lodash';

import style from "./WalletButton.module.css";
import {useWallet} from "../../api/wallet/wallet";

function truncateAddress(address?: string) {
    if (!address) {
        return "";
    }
    return address.slice(0, 6) + "..." + address.slice(-4);
}

export default function WalletButton() {
    const {signer, network, connect} = useWallet();

    const title = `${_.capitalize(network?.name)} (${truncateAddress(signer?.address)})`;
    const connected = signer !== undefined;

    useEffect(() => {
        if (!signer) {
            connect();
        }
    }, []);

    const connectedButton = (
        <Grid alignContent={"flex-start"}>
            <Grid item xs={12}>
                <Typography fontSize={14} component="div" sx={{flexGrow: 1}}>
                    {title}
                </Typography>
            </Grid>
            {/*<Grid item xs={12}>*/}
            {/*    <Button className={style.button} color="inherit">*/}
            {/*        Disconnect*/}
            {/*    </Button>*/}
            {/*</Grid>*/}
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
