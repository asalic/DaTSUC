import React from "react";
import DatasetFieldEdit from "../common/DatasetFieldEdit";
import { Badge } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import { Envelope } from "react-bootstrap-icons";
import SingleData from "../../../../../model/SingleData";
import { useGetSingleDataQuery } from "../../../../../service/singledata-api";
import LoadingView from "../../../../common/LoadingView";
import ErrorView from "../../../../common/ErrorView";
import SingleDataType from "../../../../../model/SingleDataType";
import CopiableFieldEntryProps from "../../../../common/CopiableFieldEntry";
import SingleDataFactory from "../../../../../api/SingleDataFactory";

interface SingleDataTitleProps<T extends SingleData> {
    keycloakReady: boolean;
    singleDataId: string;
    showDialog: Function;
    singleDataType: SingleDataType;
}

function SingleDataTitle<T extends SingleData>(props: SingleDataTitleProps<T>) {
    const { keycloak } = useKeycloak();

    const { data, isLoading, error, isError } = useGetSingleDataQuery({
      token: keycloak.token,
      id: props.singleDataId,
      singleDataType: props.singleDataType
    }
  )

  if (isLoading) {
    return <LoadingView what={`resource ID '${props.singleDataId}'`} />;
  } else if (isError) {
    return <ErrorView message={`Error loading resource ID '${props.singleDataId}': ${error.message ?? ""}`} />
  } else if (data) {

    return <>
        <span className="h3">
              <b className="me-1">{data?.name}
              {
                data?.editablePropertiesByTheUser.includes("draft")
                ? <DatasetFieldEdit keycloakReady={props.keycloakReady} 
                        singleDataId={props.singleDataId} showDialog={props.showDialog} field="name" 
                        fieldDisplay={`${SingleDataFactory.getTypeName(props.singleDataType)} name`} 
                        oldValue={data?.name} singleDataType={props.singleDataType}/>
                : <></>
              }
              </b>
          </span>
            <sup  className="container-fluid ms-0" style={{fontSize: "0.9rem"}}>
              {( data?.invalidated ? <Badge pill className="me-2" bg="secondary">Invalidated</Badge>: <></> )}
              {( data?.public ? <Badge pill bg="dark">Published</Badge> : <></> )}
              {( data?.draft ? <Badge pill bg="light" text="dark">Draft</Badge> : <></> )}
            </sup>

            <div>
              <i>Version </i><b>{data?.version}
              {
                data?.editablePropertiesByTheUser.includes("version")
                ? <DatasetFieldEdit keycloakReady={props.keycloakReady} 
                        singleDataId={props.singleDataId} showDialog={props.showDialog} field="version" 
                        fieldDisplay={`${SingleDataFactory.getTypeName(props.singleDataType)} version`}
                        oldValue={data?.version} singleDataType={props.singleDataType}/>
                : <></>
                
              }

              </b>
              <i> with  ID </i>
              <b>
                <CopiableFieldEntryProps text={data.id} boldText={true} 
                  title={`Copy the ${SingleDataFactory.getTypeName(props.singleDataType)} ID`} />
              </b>
              {
                data?.creationDate ?
                <>
                  <i> created on </i> 
                  <b>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                    .format(Date.parse(data?.creationDate))}</b>
                </>
                : <></>
              }
              
                {
                  keycloak.authenticated && data?.authorName ? 
                    <>
                      <i> by </i>
                        <b>{data?.authorName}</b>
                        <a className="ms-1" title="Send an email to the dataset author" href={"mailto:" + data?.authorEmail }>
                          <Envelope />
                        </a>
                    </>
                  : (<></>)
                }
              </div>
    </>
  } else {
    return <ErrorView message={`Error loading resource ID '${props.singleDataId}'`} />
  }
}

export default SingleDataTitle;