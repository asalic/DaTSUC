import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Button, ListGroup } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import AclUser from "../../../../../model/AclUser";
import { useDeleteSingleDataAclMutation } from "../../../../../service/singledata-api";
import SingleDataType from "../../../../../model/SingleDataType";

interface UserEntryProps {
    user: AclUser;
    singleDataId: string;
    singleDataType: SingleDataType
}


function UserEntry({ user, singleDataId, singleDataType }: UserEntryProps): JSX.Element {
    let { keycloak } = useKeycloak();

    // const currentUserName=keycloak?.tokenParsed?.['preferred_username'];
    // const deletable = u.username !== currentUserName;


    const [ deleteSingleDataAcl ] = useDeleteSingleDataAclMutation();

    return <ListGroup.Item  className="width-auto d-inline-flex  flex-row justify-content-between">
        <span className="me-4">{user.username}</span>
        {
            //deletable ? 
            <Button onClick={() => deleteSingleDataAcl({username: user.username, token: keycloak.token, id: singleDataId, singleDataType})} 
                        size="sm" variant="link" className="ms-4" title={`Remove user '${user.username}' from the access control list for this dataset`}>
                        <XCircleFill pointerEvents="none"/>
                    </Button>
                //: <></>
        }
    </ListGroup.Item>;

}

export default UserEntry;