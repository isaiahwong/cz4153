import React, { useEffect } from "react";
import {
  createSearchParams,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import Header from "../../components/header/Header";

import style from "./Address.module.css";
import { routes } from "../app/App";
import { dnsContract, Domain } from "../../api/dns/dns";
import { useWallet } from "../../api/wallet/wallet";
import { WithLoader } from "../../components/hoc/hoc";
import DomainPanel from "../../components/panels/DomainsPanel";
import OngoingDomainPanel, {
  OngoingDomain,
} from "../../components/panels/OngoingDomainsPanel";
import OwnerCNamePanel from "../../components/panels/OwnerCNamePanel";
import Button from "@mui/material/Button";

import CommitmentStore from "../../store/commits";

export function Address() {
  const { address } = useParams();
  const { provider, signer } = useWallet();
  const navigate = useNavigate();

  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [domains2, setDomains2] = React.useState<OngoingDomain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(true);

  useEffect(() => {
    getOwnersDomains();
    committedTLDsAndSubdomains();
  }, [address]);

  const committedTLDsAndSubdomains = async () => {
    if (!address) return;
    const mycommits = await CommitmentStore.getAllUserCommits(address);
    const domains = mycommits.map<OngoingDomain>((arg) => ({
      name: arg.subdomain,
      owner: address,
      tld: arg.tld,
    }));

    setDomains2(domains);
    setLoading2(false);
  };

  const getOwnersDomains = async () => {
    if (!address) return;

    const tlds = await dnsContract.getTLDs(provider);
    const domains = await Promise.all(
      tlds.map((tld) =>
        dnsContract.getDomainRegistered(provider, tld.name, address, undefined)
      )
    )
      .then((results) => results.flatMap((events) => events))
      .then((events) => events.map((event) => event.args))
      .then((args) =>
        args.filter(
          (arg) =>
            arg.owner == address &&
            arg.expires > BigInt(Math.round(Date.now() / 1000))
        )
      )
      .then((args) =>
        args
          .map<Domain>((arg) => ({
            name: arg.domain,
            owner: arg.owner,
            tld: arg.tld,
            expires: Number(arg.expires),
          }))
          .sort((a, b) => (a.tld > b.tld ? 1 : -1))
      );
    setDomains(domains);
    setLoading(false);
  };

  // Validate address
  if (!ethers.isAddress(address)) {
    return <Navigate to={routes.notFound} />;
  }

  return (
    <>
      <Header />
      <Grid
        container
        // className={style.content}
        alignContent={"center"}
        alignItems="center"
      >
        <Grid item xs={12}>
          <Box className={style.wrapper}>
            <Typography
              variant="h6"
              fontWeight="bold"
              className={style.highlight}
              margin={"50px 0px 50px 0px"}
            >
              {address}
            </Typography>
            <Box
              className={style.panel}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"left"}
            >
              <Typography variant="h5" fontWeight="bold">
                Your Domains
              </Typography>
              <Box
                mb={3}
                display={"flex"}
                justifyContent={"space-between"}
              ></Box>

              <OwnerCNamePanel address={address} domains={domains} />
              <WithLoader loading={loading}>
                <DomainPanel domains={domains} />
              </WithLoader>
            </Box>
            <Box
              className={style.panel}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"left"}
              margin={"100px 0px 100px 0px"}
            >
              <Box mb={3} display={"flex"} justifyContent={"space-between"}>
                <Typography variant="h5" fontWeight="bold">
                  Ongoing Bids
                </Typography>
              </Box>
              <WithLoader loading={loading2}>
                <OngoingDomainPanel domains={domains2} />
              </WithLoader>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
