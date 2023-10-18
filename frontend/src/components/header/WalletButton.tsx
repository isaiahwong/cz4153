import React, {useEffect} from "react";
import Button from "@mui/material/Button";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import _ from 'lodash';

import style from "./WalletButton.module.css";
import {useWallet} from "../../api/wallet/wallet";
import truncateAddress from "../../common/common";


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
