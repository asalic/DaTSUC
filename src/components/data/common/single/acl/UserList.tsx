import React from "react";
import { ListGroup } from "react-bootstrap";
import AclUser from "../../../../../model/AclUser";
import LoadingData from "../../../../../model/LoadingData";
import UserEntry from "./UserEntry";
import LoadingView from "../../../../common/LoadingView";


interface UserListProps {
    data: LoadingData<AclUser[]>;
    deleteAcl: Function;
    currentUserName: string;
}

function UserList(props: UserListProps): JSX.Element {

    if (props.data.loading) {
        return <LoadingView what="users in the access control list (ACL)"></LoadingView>;
    } else {
        if (props.data.data === null || props.data.data.length === 0) {
            return <p><b>No users found in the access control list (ACL).</b></p>;
        } else {
            return <>    
                <h5>List of users in the access control list (ACL):</h5>        
                <ListGroup className="width-auto  d-inline-flex">
                    {
                        props.data.data.map(u => <UserEntry key={u.uid} deletable={u.username !== props.currentUserName} deleteAcl={props.deleteAcl} user={u}></UserEntry>)
                    }
                </ListGroup>
            </>
        }
    }
}

export default UserList;