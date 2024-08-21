import { useKeycloak } from "@react-keycloak/web";
import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataManager from "../../../../../api/DataManager";
import AclUser from "../../../../../model/AclUser";
import Dataset from "../../../../../model/Dataset";
import LoadingData from "../../../../../model/LoadingData";
import LoadingError from "../../../../../model/LoadingError";
import Message from "../../../../../model/Message";
import Util from "../../../../../Util";
import UserAdd from "./UserAdd";
import UserList from "./UserList";

interface AccessControlListViewProps {
    dataManager: DataManager;
    keycloakReady: boolean;
    postMessage: Function;
    dataset: Dataset;
    singleDataId: string;
}

function getWhoCanSee(dataset: Dataset): string {
  if (dataset.draft) {
    return "The metadata of a draft dataset is visible only to its creator."
  } else if (dataset.public === false) {
    return "The metadata of a dataset that is not public is visible only to registered users that are also part of the dataset's project."
  } else {
    return "The metadata of a public dataset is visible to anyone (including users without an account)."
  }
}

function getWhoCanUse(dataset: Dataset): string {
  if (dataset.draft) {
    return "A draft dataset can be used only by its creator."
  } else if (dataset.public === false) {
    return "A dataset that is not public can be used only by registered users that are also part of the dataset's project."
  } else {
    return "A public dataset can be used by registered users that either have joined the project or are added to the dataset's ACL."
  }
}


export default function AccessControlListView(props: AccessControlListViewProps) {

    let { keycloak } = useKeycloak();
    const [data, setData] = useState<LoadingData<AclUser[]>>({
         loading: false,
         error: null,
         data: null,
         statusCode: -1
  
    });

    const getAcl = useCallback(() => {
      if (props.keycloakReady && keycloak.authenticated && keycloak.token && props.singleDataId) {
          setData( prevValues => {
             return { ...prevValues, loading: true, error: null, data: null, statusCode: -1 }
          });
          props.dataManager.getAcl(keycloak.token, props.singleDataId)
            .then(
              (xhr: XMLHttpRequest) => {
                const users: AclUser[] = JSON.parse(xhr.response);
                setData( prevValues => {
                  return { ...prevValues, loading: false, error: null, data: users, statusCode: xhr.status }
                });
              },
              (xhr: XMLHttpRequest) => {
                const error: LoadingError = Util.getErrFromXhr(xhr);
                props.postMessage(new Message(Message.ERROR, error.title, error.text));
                setData( prevValues => {
                  return { ...prevValues, loading: false, error,
                    data: null, statusCode: xhr.status }
                });
              });
      }

    }, [props.keycloakReady , keycloak, setData, props.dataManager, props.postMessage]);
    useEffect(() => getAcl(), [getAcl]);
    const addAclUserCb = useCallback((user: AclUser) => {
        // setData((prevData) => {
        //     const newData  = [...(prevData.data ?? []), user];
        //     return {...prevData, data: newData};
        // })
        getAcl();
    }, [getAcl]);


    const deleteAcl = useCallback((username: string) => {
      if (props.keycloakReady && keycloak.authenticated && keycloak.token && props.singleDataId) {
          props.dataManager.deleteAcl(keycloak.token, props.singleDataId, username)
            .then(
              (xhr: XMLHttpRequest) => {
                const users: AclUser[] = data.data?.filter(u => u.username !== username) ?? [];
                console.log(users);
                setData( prevValues => {
                  return { ...prevValues, data: users }
                });
              },
              (xhr: XMLHttpRequest) => {
                const error: LoadingError = Util.getErrFromXhr(xhr);
                props.postMessage(new Message(Message.ERROR, error.title, error.text));
              });
      }


    }, [props.keycloakReady, keycloak.authenticated, setData, data, props.postMessage]);
    return <Container>
      <p>
        {
          getWhoCanSee(props.dataset)
        }
        <br></br>
        {
          getWhoCanUse(props.dataset)
        }
      </p>
      <p>
      </p>
      {
        // props.dataset && !props.dataset.public ? 
        // <Alert variant="warning">
        //   <p>
        //     This dataset is not public, therefore the access control list is ignored.
        //     Right now, this dataset is visible and accessible only to those users that are members of the same project that this dataset is part of.
        //   </p>
        // </Alert>
        // : <></>
      }
        <UserAdd dataManager={props.dataManager} postMessage={props.postMessage}  addAclUser={addAclUserCb} keycloakReady={props.keycloakReady}></UserAdd>
        <UserList currentUserName={keycloak.tokenParsed?.['preferred_username']} deleteAcl={deleteAcl} data={data} />

    </Container>;

}