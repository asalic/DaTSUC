import React from "react";

interface ErrorViewProps {
    message?: string | null | undefined;
}

function ErrorView({ message }: ErrorViewProps): JSX.Element {
    return <h4 className="text-danger">{message ?? "An error has occured"}</h4>;
}

export default ErrorView;