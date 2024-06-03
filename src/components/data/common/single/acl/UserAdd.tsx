import { useKeycloak } from "@react-keycloak/web";
import React, { FormEvent, useCallback, useRef, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import DataManager from "../../../../../api/DataManager";
import LoadingData from "../../../../../model/LoadingData";
import LoadingError from "../../../../../model/LoadingError";
import Util from "../../../../../Util";
import { useParams } from "react-router-dom";
import LoadingView from "../../../../common/LoadingView";

interface UserAddProps {
    dataManager: DataManager;
    postMessage: Function;
    addAclUser: Function;
    keycloakReady: boolean;
}

export default function UserAdd(props: UserAddProps) {
    let { keycloak } = useKeycloak();
    const params = useParams();
    const [data, setData] = useState<LoadingData<string>>({
        loading: false,
        error: null,
        data: null,
        statusCode: -1
    });
    const formRef = useRef(null);
    const singleDataId: string | undefined = params["singleDataId"];

    const addUserCb = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.keycloakReady && keycloak.authenticated && keycloak.token && singleDataId) {
            const formData = new FormData(e.target as HTMLFormElement);
            const username = formData.get("username")?.toString();
            if (username) {
                setData((prev) => {
                    return {...prev, loading: true, error: null, statusCode: -1, data: null}
                });
                props.dataManager.putAcl(keycloak.token, singleDataId, username)
                .then(
                    (xhr: XMLHttpRequest) => {
                        setData((prev) => {
                            return {...prev, loading: false, error: null, statusCode: xhr.status, data: username}
                        });
                        props.addAclUser(username);
                        (e.target as HTMLFormElement).reset();
                    },
                    (xhr: XMLHttpRequest) => {
                      const error: LoadingError = Util.getErrFromXhr(xhr);
                      setData((prev) => {
                          return {...prev, loading: false, error, statusCode: xhr.status}
                      });
                      //props.postMessage(new Message(Message.ERROR, error.title, error.text, data: username));
                    });

            }
        }
    }, [props.dataManager, props.postMessage, props.addAclUser, props.keycloakReady, keycloak])

    return <Form noValidate onSubmit={addUserCb} ref={formRef}>
        <Form.Group className="mb-3 d-flex flex-row" controlId="acl.addUser">
            <Form.Control disabled={data.loading} className="mt-2 me-2" size="sm" name="username" type="text" placeholder="Enter the username as defined in Keycloak." />
            <Button disabled={data.loading} size="sm" type="submit" className="mt-2 mb-2 me-0 float-end" title="Add the user to the list that have access to this dataset">Add</Button>
        </Form.Group>
            {
                data.loading ? <div className="mb-2"><LoadingView fullMessage="Adding user, please wait..."></LoadingView></div> : <></>
            }
            {
                data.error ? <Alert className="mb-2" variant="danger" dismissible={true}>{"Error adding user: " + data.error.title}</Alert> 
                    : <></>
            }
            {
                data.error === null && data.data !== null ? <Alert className="mb-2" variant="success" dismissible={true}>{`User '${data.data ?? ""}' added succesfully.`}</Alert>
                    : <></>
            }
            
    </Form>
} 