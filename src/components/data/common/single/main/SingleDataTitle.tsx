import React from "react";
import DataManager from "../../../../../api/DataManager";
import DatasetFieldEdit from "../common/DatasetFieldEdit";
import { Badge } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import { EnvelopeFill } from "react-bootstrap-icons";
import SingleData from "../../../../../model/SingleData";

interface SingleDataTitleProps<T extends SingleData> {
    keycloakReady: boolean;
    dataManager: DataManager;
    datasetId: string;
    showDialog: Function;
    patchDataset: Function;
    data: T;
}

function SingleDataTitle<T extends SingleData>(props: SingleDataTitleProps<T>) {
    const { keycloak } = useKeycloak();
    return <>
        <span className="h3">
              <b className="me-1">{props.data.name}
              {
                props.data.editablePropertiesByTheUser.includes("draft")
                ? <DatasetFieldEdit keycloakReady={props.keycloakReady} dataManager={props.dataManager} 
                        datasetId={props.datasetId} showDialog={props.showDialog} field="name" fieldDisplay="Dataset name" 
                        oldValue={props.data.name} patchDataset={props.patchDataset}/>
                : <></>
              }
              </b>
          </span>
            <sup  className="container-fluid ms-0" style={{fontSize: "0.9rem"}}>
              {( props.data.invalidated ? <Badge pill className="me-2" bg="secondary">Invalidated</Badge>: <></> )}
              {( props.data.public ? <Badge pill bg="dark">Published</Badge> : <></> )}
              {( props.data.draft ? <Badge pill bg="light" text="dark">Draft</Badge> : <></> )}
            </sup>
            <div>
              <i>Created on </i> 
                {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                    .format(Date.parse(props.data.creationDate))}
                {keycloak.authenticated ? (
                <>
                  <i> by </i>
                    {props.data.authorName}
                    <a className="ms-1" title="Send an email to the dataset author" href={"mailto:" + props.data.authorEmail }>
                      <EnvelopeFill />
                    </a>
                    </>
                ) : (<></>)}
              </div>
    </>
}

export default SingleDataTitle;