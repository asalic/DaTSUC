import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import AclUser from "../../../model/AclUser";

interface UserEntryProps {
    user: AclUser;
    deleteAcl: Function;
    deletable: boolean;
}


function UserEntry({ user, deleteAcl, deletable }: UserEntryProps): JSX.Element {

    return <ListGroup.Item  className="width-auto d-inline-flex  flex-row justify-content-between">
        <span className="me-4">{user.username}</span>
        {
            //deletable ? 
            <Button onClick={() => deleteAcl(user.username)} size="sm" variant="link" className="ms-4" title={`Remove user '${user.username}' from the access control list for this dataset`}>
                        <XCircleFill pointerEvents="none"/>
                    </Button>
                //: <></>
        }
    </ListGroup.Item>;

}

export default UserEntry;