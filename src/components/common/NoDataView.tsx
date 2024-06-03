import React from "react";

interface NoDataView {
    message?: string | undefined;
}

export default function NoDataView({ message }: NoDataView) {
    return <h5>{message ?? "No data found."}</h5>;
}