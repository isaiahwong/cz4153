import React, {useEffect, useState} from "react";
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Box,
    CircularProgress,
    Grid, Table, TableBody, TableCell, TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useWallet} from "../../api/wallet/wallet";
import {ethers} from "ethers";
import {WithConnect, WithLoader} from "../hoc/hoc";
import LoadingButton from "@mui/lab/LoadingButton";

import style from "./TransactionPanel.module.css";
import {dnsContract} from "../../api/dns/dns";
import Button from "@mui/material/Button";
import {useSearchParams} from "react-router-dom";

const SuccessPanel = (amount: number, to: string, domain: string, onClick: () => void) => {
    if (!amount || !to || !domain) {
        onClick();
        return (<></>);
    }

    return (
        <Box
            className={style.panel}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Table sx={{minWidth: 300}} aria-label="simple table">
                <TableBody>
                    <TableRow sx={{'td, th': {border: 0}}}>
                        <TableCell component="th" scope="row">
                            <Typography fontWeight={"bold"}>
                                Domain
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            {domain}
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{'td, th': {border: 0}}}>
                        <TableCell component="th" scope="row">
                            <Typography fontWeight={"bold"}>
                                Amount
                            </Typography>
                        </TableCell>
                        <TableCell  align="right">
                            {amount} ETH
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{'td, th': {border: 0}}}>
                        <TableCell component="th" scope="row">
                            <Typography fontWeight={"bold"}>
                                To
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant={"body1"}>
                                {to}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box mt={3}>
                <Button
                    variant="contained"
                    className={style.button}
                    onClick={onClick}
                >
                    <Typography variant="body1" fontWeight="bold">
                        Back
                    </Typography>
                </Button>
            </Box>
        </Box>
    )
}

export default function TransactionPanel() {
    const {provider, signer, connect} = useWallet();
    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState<boolean>(true);
    const [txSubmitted, setTxSubmitted] = useState<boolean>(true);
    const [showSuccess, setShowSuccess] = useState<boolean>(true);

    const [paramDomain, setParamDomain] = useState<string>('');
    const [searchDomain, setSearchDomain] = useState('')
    const [etherAmount, setEtherAmount] = useState(0.001)
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
    const [errorSearch, setErrorSearch] = useState<string | null>(null);

    useEffect(() => {
        if (!signer) connect();
        const domain = searchParams.get('send');
        if (domain) {
            setParamDomain(domain);
            setSearchDomain(domain);
        }
    }, []);

    useEffect(() => {
        if (!signer) return;
        setLoading(false);
    }, [signer]);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!searchDomain) return;
            const search = searchDomain.split('.').splice(-1).join('');
            const request: Record<string, string> = {};

            request[searchDomain] = await dnsContract.getAddr(provider, searchDomain);

            setSearchTerms({...request})
            onChange(null, searchDomain);
        }, 1000);

        return () => clearTimeout(delay)
    }, [searchDomain])

    const onChange = (_: any, v: any) => {
        if (!searchTerms[v] || searchTerms[v] == dnsContract.EMPTY_ADDRESS) {
            setErrorSearch('Domain does not exist');
            return;
        }
        setErrorSearch(null);
    }

    const onAmountChange = (e: any) => {
        setEtherAmount(e.target.value);
    }

    const onReset = () => {
        setShowSuccess(false);
        setSearchDomain('');
        setEtherAmount(0.001);
        setSearchTerms({});
        setSearchParams({});
        setParamDomain('');
    }

    const onSubmit = async () => {
        if (!signer || errorSearch) return;

        if (!searchDomain || !searchTerms[searchDomain] || searchTerms[searchDomain] == dnsContract.EMPTY_ADDRESS) {
            setErrorSearch('Domain does not exist');
            return;
        }

        const tx = await signer.sendTransaction({
            to: searchTerms[searchDomain],
            value: ethers.parseEther(etherAmount.toString())
        })
        await tx.wait();
        setTxSubmitted(true);
        setShowSuccess(true);
    }

    if (showSuccess) {
        return SuccessPanel(etherAmount, searchTerms[searchDomain], searchDomain, onReset);
    }

    return (
        <>
            <WithLoader loading={loading}>
                <WithConnect onClick={() => connect()} pred={!!signer}>
                    <Box className={style.panel} display={"flex"} flexDirection={"column"}>
                        <Autocomplete
                            className={style.search}
                            onChange={onChange}
                            id="free-solo-demo"
                            defaultValue={paramDomain}
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
                                            <Grid item>
                                                {option}
                                            </Grid>
                                            <Grid item>
                                                {
                                                    searchTerms[option] !== dnsContract.EMPTY_ADDRESS
                                                        ?
                                                        (
                                                            <Typography className={style.green}>
                                                                {searchTerms[option]}
                                                            </Typography>
                                                        ) :
                                                        (
                                                            <Typography className={style.red}>
                                                                Does not exist
                                                            </Typography>
                                                        )
                                                }
                                            </Grid>
                                        </Grid>
                                    </li>
                                )
                            }}
                            renderInput={
                                (params: AutocompleteRenderInputParams) => {
                                    return <TextField
                                        {...params}
                                        error={!!errorSearch}
                                        helperText={errorSearch}
                                        className={style.search_input}
                                        onChange={(e) => setSearchDomain(e.target.value)}
                                        placeholder={"Enter DNS Recipient"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                }
                            }
                        />
                        <Box mt={2} display={"flex"} flexDirection={"row"} alignItems={"center"}
                             justifyContent={"space-between"}>
                            <Typography fontWeight={900}>
                                Amount
                            </Typography>
                            <TextField
                                className={style.search_input}
                                placeholder={"Enter Amount"}
                                type="number"
                                onChange={onAmountChange}
                                value={etherAmount}
                                error={etherAmount <= 0}
                                helperText={etherAmount <= 0 ? "Value too low" : ""}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <Box mt={2}>
                            <LoadingButton
                                loading={!txSubmitted}
                                variant="contained"
                                onClick={onSubmit}
                                loadingIndicator={<CircularProgress style={{color: "white"}} size={16}/>}
                                style={{width: "100%", borderRadius: "20px", backgroundColor: "#5105FF"}}
                            >
                                <Typography variant="body1" fontWeight="bold">
                                    Send ETH
                                </Typography>
                            </LoadingButton>
                        </Box>
                    </Box>
                </WithConnect>
            </WithLoader>
        </>
    );
}