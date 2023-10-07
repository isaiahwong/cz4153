import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Box,
    Grid,
    TextField
} from '@mui/material';
import style from "./Landing.module.css";
import TLDList from "../../components/tld/TLDList";
import {TLD} from '../../api/dns/dns';
import {WithPred} from "../../components/hoc/hoc";
import {useWallet} from "../../api/wallet/wallet";
import Header from "../../components/header/Header";
import {dnsContract} from "../../api/contract/contract";


export default function Landing() {
    const [selectedTld, setTLD] = useState<TLD>();
    const [searchDomain, setSearchDomain] = useState('')
    const [searchTerms, setSearchTerms] = useState<Record<string, boolean>>({})
    const navigate = useNavigate();
    const {signer, provider} = useWallet();

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!selectedTld || !searchDomain) return;

            const search = dnsContract.removeTLD(selectedTld.name, searchDomain);
            const available = await dnsContract.isAvailable(provider, selectedTld.name, search);
            const fqdn = `${search}.${selectedTld.name}`;

            if (available) {
                setSearchTerms({...searchTerms, [fqdn]: available})
            }
        }, 1000);

        return () => clearTimeout(delay)
    }, [searchDomain])

    const onTLDSelected = (tld?: TLD) => {
        setTLD(tld);
    }

    const onChange = (e: any, v: any) => {
        navigate(`/d/${v}`)
    }

    return (
        <>
            <Header/>
            <Grid container className={style.content} alignContent={"center"} alignItems="center">
                <Grid item xs={12}>
                    <Box className={style.panel}>
                        <TLDList onClick={onTLDSelected}/>
                        <WithPred pred={!!selectedTld}>
                            <Box mt={4}>
                                <Autocomplete
                                    className={style.search}
                                    id="free-solo-demo"
                                    onChange={onChange}
                                    options={Object.keys(searchTerms)}
                                    renderOption={(props: any, option: string) => {
                                        return (
                                            <li {...props}>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Grid item >
                                                        {option}
                                                    </Grid>
                                                    <Grid item >
                                                        {searchTerms[option] ? "Available" : "Taken"}
                                                    </Grid>
                                                </Grid>
                                            </li>
                                        )
                                    }}
                                    renderInput={
                                        (params: AutocompleteRenderInputParams) => {
                                            return <TextField
                                                onChange={(e) => setSearchDomain(e.target.value)}
                                                label="Search for DNS"
                                                {...params}
                                            />
                                        }
                                    }
                                />
                            </Box>
                        </WithPred>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}