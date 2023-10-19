import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import style from "./Landing.module.css";
import { dnsContract, TLD } from "../../api/dns/dns";
import { WithLoader } from "../../components/hoc/hoc";
import { useWallet } from "../../api/wallet/wallet";
import Header from "../../components/header/Header";
import DomainStore from "../../store/domains";
import { routes } from "../app/App";

export default function Landing() {
  const [tlds, setTLDS] = useState<TLD[]>();
  // const [selectedTld, setTLD] = useState<TLD>();
  const [searchDomain, setSearchDomain] = useState("");
  const [searchTerms, setSearchTerms] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { provider } = useWallet();

  useEffect(() => {
    (async () => {
      const tlds = await dnsContract.getTLDs(provider);
      setTLDS(tlds);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!tlds || !searchDomain) return;

      // check if alphanumeric or if period not last character, else return
      if (
        !(
          /^[a-zA-Z0-9]+$/.test(searchDomain) ||
          (searchDomain.split(".").length - 1 == 1 &&
            searchDomain.charAt(searchDomain.length - 1) !== ".")
        )
      ) {
        return;
      }

      const search = searchDomain.split(".").splice(-1).join("");
      const request: Record<string, boolean> = {};
      for (let tld of tlds) {
        const fqdn = `${search}.${tld.name}`;
        request[fqdn] = await dnsContract.isAvailable(
          provider,
          tld.name,
          search
        );
        await DomainStore.setFQDN({ name: fqdn, available: request[fqdn] });
      }

      setSearchTerms(request);
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchDomain]);

  const onChange = (_: any, v: any) => {
    navigate(routes.domain(v));
  };

  const handleClose = () => {
    setSearchTerms({});
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
          <Box className={style.panel}>
            {/*<TLDList onClick={onTLDSelected}/>*/}
            <Typography variant={"h4"} fontWeight={"900"}>
              Start Searching for a domain
            </Typography>
            <WithLoader loading={loading}>
              <Box mt={4}>
                <Autocomplete
                  className={style.search}
                  id="free-solo-demo"
                  onChange={onChange}
                  onClose={handleClose}
                  loading
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
                          <Grid item>{option}</Grid>
                          <Grid item>
                            {searchTerms[option] ? "Available" : "Taken"}
                          </Grid>
                        </Grid>
                      </li>
                    );
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => {
                    return (
                      <TextField
                        {...params}
                        className={style.search_input}
                        onChange={(e) => setSearchDomain(e.target.value)}
                        sx={{ "& fieldset": { border: "none" } }} // Removes border
                        placeholder={"Search for a DNS"}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    );
                  }}
                />
              </Box>
            </WithLoader>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
