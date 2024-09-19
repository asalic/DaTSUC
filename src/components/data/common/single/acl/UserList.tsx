import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { ListGroup } from "react-bootstrap";
import UserEntry from "./UserEntry";
import LoadingView from "../../../../common/LoadingView";
import { useGetSingleDataAclQuery } from "../../../../../service/singledata-api";
import SingleDataType from "../../../../../model/SingleDataType";
import ErrorView from "../../../../common/ErrorView";


interface UserListProps {
    singleDataId: string;
    singleDataType: SingleDataType;
    keycloakReady: boolean;
}

function UserList({ singleDataId, singleDataType, keycloakReady }: UserListProps): JSX.Element {
    let { keycloak } = useKeycloak();


    const { data, isLoading, error, isError } = useGetSingleDataAclQuery({
        token: keycloak.token,
        id: singleDataId,
        singleDataType
      },
      {
        skip: !(keycloakReady && singleDataId)
      }
    )

    if (isLoading) {
        return <LoadingView what="users in the access control list (ACL)"></LoadingView>;
    }  else if (isError) {
        return <ErrorView message={`Error loading data: ${"message" in error ? error.message : JSON.stringify(error) }`} />
    } else {
        if (data === undefined || data === null || data.length === 0) {
            return <p><b>No users found in the access control list (ACL).</b></p>;
        } else {
            return <>    
                <h5>List of users in the access control list (ACL):</h5>        
                <ListGroup className="width-auto  d-inline-flex">
                    {
                        data?.map(u => <UserEntry key={u.uid} singleDataId={singleDataId} singleDataType={singleDataType} user={u}></UserEntry>)
                    }
                </ListGroup>
            </>
        }
    }
}

export default UserList;