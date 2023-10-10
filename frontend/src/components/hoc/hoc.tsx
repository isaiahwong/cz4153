import React from "react";
import {Box, Button, CircularProgress } from "@mui/material";

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

export function WithLoader(props: { loading: boolean, children: any }) {
    if (!props.loading) {
        return props.children;
    }
    return (
        <Loader />
    );
}

export function WithConnect(props: { onClick: any, pred: boolean, children: any }) {
    if (props.pred) {
        return props.children;
    }
    return (
        <Button onClick={props.onClick}>
            Connect
        </Button>
    );
}