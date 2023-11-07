import React, {useEffect} from "react";
import Alert from '@mui/material/Alert';
import {AlertTitle} from "@mui/material";

interface SuccessProps {
    message: string;
    dismiss?: number;
    show?: boolean;
}

export default function InfoAlert(props: SuccessProps) {
    const {message,dismiss, show} = props;

    const [open, setOpen] = React.useState(show ?? false);

    useEffect(() => {
        let interval: NodeJS.Timer | undefined;

        if (dismiss && dismiss > 0) {
            interval = setInterval(() => {
                setOpen(false);
            }, dismiss ?? 5000);
        }

        if (show) {
            setOpen(true);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [show]);

    if (!open) {
        return <></>;
    }

    return (
        <Alert style={{width: "100%"}} severity="info">
            {message}
        </Alert>
    )
}