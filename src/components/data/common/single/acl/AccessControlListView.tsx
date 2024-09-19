import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Container } from "react-bootstrap";
import UserAdd from "./UserAdd";
import UserList from "./UserList";
import SingleDataType from "../../../../../model/SingleDataType";
import { useGetSingleDataQuery } from "../../../../../service/singledata-api";
import LoadingView from "../../../../common/LoadingView";
import ErrorView from "../../../../common/ErrorView";
import SingleData from "../../../../../model/SingleData";

interface AccessControlListViewProps {
    keycloakReady: boolean;
    singleDataId: string;
    singleDataType: SingleDataType
}

function getWhoCanSee(dataset: SingleData): string {
  if (dataset.draft) {
    return "The metadata of a draft dataset is visible only to its creator."
  } else if (dataset.public === false) {
    return "The metadata of a dataset that is not public is visible only to registered users that are also part of the dataset's project."
  } else {
    return "The metadata of a public dataset is visible to anyone (including users without an account)."
  }
}

function getWhoCanUse(dataset: SingleData): string {
  if (dataset.draft) {
    return "A draft dataset can be used only by its creator."
  } else if (dataset.public === false) {
    return "A dataset that is not public can be used only by registered users that are also part of the dataset's project."
  } else {
    return "A public dataset can be used by registered users that either have joined the project or are added to the dataset's ACL."
  }
}


export default function AccessControlListView({singleDataId, keycloakReady, singleDataType}: AccessControlListViewProps) {

    let { keycloak } = useKeycloak();

    const { data, isLoading, error, isError } = useGetSingleDataQuery({
      token: keycloak.token,
      id: singleDataId,
      singleDataType
    },
    {
      skip: !(keycloakReady && singleDataId)
    }
  )

    if (isLoading) {
      return <LoadingView what="data" />;
    } else if (isError) {
      return <ErrorView message={`Error loading data: ${"message" in error ? error.message : JSON.stringify(error) }`} />
    } else {
      return <Container>
        {
          data ? 
            <p>
              {
                getWhoCanSee(data)
              }
              <br></br>
              {
                getWhoCanUse(data)
              }
            </p>
            : <></>
        }
        <UserAdd singleDataId={singleDataId} singleDataType={singleDataType} keycloakReady={keycloakReady}></UserAdd>
        <UserList singleDataId={singleDataId} singleDataType={singleDataType} keycloakReady={keycloakReady} />

      </Container>;
    }

}