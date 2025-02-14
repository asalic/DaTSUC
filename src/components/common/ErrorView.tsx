import React from "react";
import { Alert } from "react-bootstrap";

interface ErrorViewProps {
    message?: string | null | undefined;
}

function ErrorView({ message }: ErrorViewProps): JSX.Element {
    return <Alert variant="danger">{message ?? "An error has occured"}</Alert>;
}

export default ErrorView;