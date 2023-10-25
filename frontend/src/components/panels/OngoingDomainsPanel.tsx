import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { routes } from "../../routes/app/App";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import style from "../../routes/address/Address.module.css";
import { useWallet } from "../../api/wallet/wallet";

export interface OngoingDomain {
  name: string;
  tld: string;
  owner: string;
  // expires: number;
}

export interface OngoingDomainPanelProps {
  domains: OngoingDomain[];
}

export default function OngoingDomainPanel(props: OngoingDomainPanelProps) {
  const { domains } = props;
  const navigate = useNavigate();
  const { signer, connect } = useWallet();

  useEffect(() => {
    if (!signer) connect();
  }, []);

  if (domains.length == 0) {
    return (
      <>
        <Typography>No ongoing bids</Typography>
      </>
    );
  }

  const onviewBid = (domain: string) => {
    navigate({
      pathname: routes.sendEther,
      search: createSearchParams({ send: domain }).toString(),
    });
  };

  const viewBid = (domain: OngoingDomain) => {
    if (!domain.owner || (signer && signer.address == domain.owner)) {
      return <></>;
    }
    return (
      <Button
        variant="contained"
        className={style.button}
        onClick={() => onviewBid(`${domain.name}.${domain.tld}`)}
      >
        <Typography variant="body1" fontWeight="bold">
          View Bid
        </Typography>
      </Button>
    );
  };

  // domain / efg.dev;

  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell align="left">TLD</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {domains.map((domain, i) => (
            <TableRow key={i} sx={{ "td, th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Typography fontWeight={"bold"}>{domain.name}</Typography>
              </TableCell>
              <TableCell component="th" scope="row">
                <Typography fontWeight={"bold"}>{domain.tld}</Typography>
              </TableCell>
              <TableCell align="right">
                <Link
                  to={routes.domain(`${domain.name}.${domain.tld}`)}
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="contained" className={style.button}>
                    <Typography variant="body1" fontWeight="bold">
                      View Bid
                    </Typography>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
