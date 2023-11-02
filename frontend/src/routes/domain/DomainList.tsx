import React, { useEffect } from "react";

import Header from "../../components/header/Header";
import DomainPanel from "../../components/panels/DomainsPanel";
import { Domain, dnsContract } from "../../api/dns/dns";
import { useWallet } from "../../api/wallet/wallet";

import { Box, Grid, Typography } from "@mui/material";
import { WithLoader } from "../../components/hoc/hoc";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import style from "./DomainCommon.module.css";

export default function DomainList() {
  const { provider, signer } = useWallet();
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [domainList, setDomainsList] = React.useState(Array);
  const [domainsFiltered, setDomainsFiltered] = React.useState<Domain[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getOwnersDomains();
  }, []);

  const getOwnersDomains = async () => {
    const domains = await dnsContract.getAllDomainRegistered(provider);
    domains.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    setDomains(domains);
    setDomainsFiltered(domains);
    setDomainsList([...new Set(domains.map((d) => d.name))]);
    setLoading(false);
  };

  const onChange = (data: any[], query: string) => {
    if (!query) {
      setDomainsFiltered(data);
    }
    setDomainsFiltered(
      data.filter((d) => d.name.toLowerCase().includes(query))
    );
  };

  return (
    <>
      <Header />
      <Grid
        container
        className={style.content}
        alignContent={"center"}
        alignItems="center"
      >
        <Grid item xs={12}>
          <Box className={style.wrapper}>
            <Typography variant={"h5"} fontWeight={"900"}>
              All Registered Domains
            </Typography>

            <TextField
              className={style.search}
              sx={{ "& fieldset": { border: "none" } }} // Removes border
              placeholder={"Search for a registered domain"}
              onChange={(e) => onChange(domains, e.target.value)}
            />

            <Box
              className={style.panel}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <WithLoader loading={loading}>
                <DomainPanel domains={domainsFiltered} showOwner />
              </WithLoader>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
