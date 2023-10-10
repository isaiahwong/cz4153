import React, {useEffect, useState} from "react";
import {Box, FormControl, MenuItem, Select, Typography} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import {useWallet} from "../../api/wallet/wallet";
import {Domain} from "./DomainsPanel";
import {dnsContract} from "../../api/dns/dns";
import {WithPred} from "../hoc/hoc";

const style = {
    backgroundColor: "rgba(0, 73, 227, 0.1)",
    borderRadius: "10px",
    padding: "15px 18px",
    marginBottom: "20px",
}

interface CNameProps {
    cname: string
}

const CName = (props: CNameProps) => {
    const { cname } = props;

    if (!cname) {
        return <></>;
    }

    return (
        <Box display={"flex"} flexDirection={"row"} mb={4} justifyContent={"space-between"}>
            <Typography variant={"h6"} fontWeight={"bold"}>
                CNAME
            </Typography>
            <Typography variant={"h6"} fontWeight={"bold"}>
                {cname}
            </Typography>
        </Box>
    )
}

interface OwnerCNamePanelProps {
    address: string
    domains: Domain[]
}

export default function OwnerCNamePanel(props: OwnerCNamePanelProps) {
    const {provider, connect, signer} = useWallet();
    const [cname, setCName] = React.useState<string>("");
    const [loadOwnerPanel, setLoadOwnerPanel] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState("");
    const {domains} = props;

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!signer) return;
        if (signer.address != props.address) return;
        setLoadOwnerPanel(false);
    }, [signer]);

    const init = async () => {
        if (!signer) await connect();
        await pollCName(true);
    }

    const setCanonicalName = async () => {
        if (selectedDomain == cname) return;
        if (!selectedDomain) return;
        if (!signer) {
            await connect();
            return;
        }

        const [name, tld] = selectedDomain.split(".");
        await dnsContract.setCName(provider, signer, tld, name);
        await pollCName(false);
    }

    const pollCName = async (once: boolean) => {
        const cname = await dnsContract.cname(provider, props.address);
        setSelectedDomain(cname);
        setCName(cname);
        if (once || cname) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setInterval(() => pollCName(false), 1000);
    }

    const fqdn = (domain: Domain) => `${domain.name}.${domain.tld}`;

    return (
        <>
            <CName cname={cname} />
            <WithPred pred={!loadOwnerPanel}>
                <Box style={style} display={"flex"} flexDirection={"column"} justifyContent={"end"} alignItems={"end"}>
                    <Box display={"flex"} flexDirection={"row"} mb={2} alignItems={"center"} justifyContent={"space-between"} style={{width: "100%"}}>
                        <Typography variant={"body1"} fontWeight={"bold"}>
                            Set your canonical name
                        </Typography>
                        <FormControl sx={{minWidth: "120px"}} style={{backgroundColor: "white"}} size="small">
                            <Select
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value={""}>
                                    <em>None</em>
                                </MenuItem>
                                {domains.map((domain, i) => (
                                    <MenuItem key={i} value={fqdn(domain)}>{fqdn(domain)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        onClick={setCanonicalName}
                        style={{width: "140px", borderRadius: "20px",  backgroundColor: "#5105FF"}}
                    >
                        <Typography variant="body1" fontWeight="bold">
                            Set CName
                        </Typography>
                    </LoadingButton>
                </Box>
            </WithPred>
        </>

    )
}