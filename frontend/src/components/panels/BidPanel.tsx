import {Box, CircularProgress, TextField, Typography} from "@mui/material";
import style from "../../routes/domain/Domain.module.css";
import Button from "@mui/material/Button";
import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

interface BidPanelProps {
    bid: number;
    onBidChange: (e: any) => void;
    onClick: () => void;
    loading?: boolean;
}

export default function BidPanel(props: BidPanelProps) {
    const {bid, onBidChange, loading} = props;
    return (
        <Box textAlign={"right"} width={"100%"}>
            <TextField
                className={style.field}
                type="number"
                label="Enter Bid"
                defaultValue={0.003}
                onChange={onBidChange}
                error={bid < 0.003}
                helperText={bid < 0.003 ? "Bid must be at least 0.003 ETH" : ""}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Box mt={2}>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    onClick={props.onClick}
                    loadingIndicator={<CircularProgress style={{color: "white"}} size={16}/>}
                    style={{width: "140px", borderRadius: "20px", backgroundColor: "#5105FF"}}
                >
                    <Typography variant="body1" fontWeight="bold">
                        COMMIT
                    </Typography>
                </LoadingButton>
            </Box>
        </Box>
    )
}