import React from "react";
import {Box, CircularProgress } from "@mui/material";

export function Loader() {
    return (
        <Box sx={{ display: "flex" }}>
            <CircularProgress />
        </Box>
    );
}

export function WithPred(props: { pred: boolean, children: any }) {
    if (props.pred) {
        return props.children;
    }
    return (
        <></>
    );
}

export function WithLoader(props: { pred: boolean, children: any }) {
    if (props.pred) {
        return props.children;
    }
    return (
        <Loader />
    );
}