import React, {useEffect, useState} from 'react';
import {Grid, Typography} from "@mui/material";
import _ from 'lodash';
import {dnsContract} from "../../api/contract/contract";
import {TLD} from "../../api/dns/dns";

import style from "./TLDList.module.css";

function TLDList() {
    const [tlds, setTLDS] = useState<TLD[]>();

    useEffect(() => {
        (async () => {
            const tlds = await dnsContract.getTLDs();
            setTLDS(tlds);
        })();
    }, []);

    return (
        <Grid container className={style.tld}>
            <Typography variant="h4" fontWeight="bold">
                Select a Top Level Domain
            </Typography>
            {tlds?.map((tld) => (
                <Grid item xs={6} className={style.item} alignItems="center">
                    <Typography variant="h4" fontWeight="bold">
                        {tld.name}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    )
}

TLDList.defaultProps = {

}

export default TLDList;