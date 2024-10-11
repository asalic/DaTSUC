import { useKeycloak } from "@react-keycloak/web";
import React, { FormEvent, useCallback, useRef, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import LoadingView from "../../../../common/LoadingView";
import SingleDataType from "../../../../../model/SingleDataType";
import { usePutSingleDataAclMutation } from "../../../../../service/singledata-api";

interface UserAddProps {
    singleDataId: string;
    singleDataType: SingleDataType;
    keycloakReady: boolean;
}

export default function UserAdd({ singleDataId, singleDataType, keycloakReady  }: UserAddProps) {
    let { keycloak } = useKeycloak();
    const [uName, setUName] = useState("");
    const formRef = useRef(null);
    const [ putSingleDataAcl, { data, isLoading, error, isError }] = usePutSingleDataAclMutation();

    const addUserCb = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (keycloakReady && keycloak.authenticated && keycloak.token && singleDataId) {
            const formData = new FormData(e.target as HTMLFormElement);
            const username = formData.get("username")?.toString();
            if (username) {
                setUName(username);
                putSingleDataAcl({token: keycloak.token, id: singleDataId, singleDataType, username});
            }
        }
    }, [putSingleDataAcl, keycloakReady, keycloak, singleDataId, singleDataType, uName, setUName])

    return <Form noValidate onSubmit={addUserCb} ref={formRef}>
        <Form.Group className="mb-3 d-flex flex-row" controlId="acl.addUser">
            <Form.Control disabled={isLoading} className="mt-2 me-2" size="sm" name="username" type="text" placeholder="Enter the username as defined in Keycloak." />
            <Button disabled={isLoading} size="sm" type="submit" className="mt-2 mb-2 me-0 float-end" title="Add the user to the list that have access to this dataset">Add</Button>
        </Form.Group>
            {
                isLoading ? <div className="mb-2"><LoadingView fullMessage="Adding user, please wait..."></LoadingView></div> : <></>
            }
            {
                isError ? <Alert className="mb-2" variant="danger" dismissible={true}>
                    {"Error adding user: " + "message" in error ? error.message : JSON.stringify(error)}</Alert> 
                    : <></>
            }
            {
                !isError && !isLoading && data === true
                    ? <Alert className="mb-2" variant="success" dismissible={true}>{`User '${uName}' added succesfully.`}</Alert>
                    : <></>
            }
            
    </Form>
} 