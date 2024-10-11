import React from "react";
import { Alert } from "react-bootstrap";

interface ProgrammaticErrorT {
    msg?: string | null
}


function ProgrammaticError({ msg }: ProgrammaticErrorT): JSX.Element {
    return <Alert >
        {msg ?? "An unhandled error has occured. Please contact the administrator."}
    </Alert>
}

export default ProgrammaticError;