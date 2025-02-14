import React from "react";
import { Alert, Image } from "react-bootstrap";
import ErrorView from "../common/ErrorView";
import LoadingView from "../common/LoadingView";
import { useKeycloak } from "@react-keycloak/web";
import { useGetProjectConfigQuery, useGetProjectQuery, usePatchProjectMutation } from "../../service/singledata-api";
import { Link, useParams } from "react-router-dom";
import Util from "../../Util";
import NoLogoAvailable from "../common/NoLogoAvailable";
import UrlFactory from "../../service/UrlFactory";
import GenericFieldEdit from "../common/fieldedit/GenericFieldEdit";
import BodyFactorySpecType from "../../model/BodyFactorySpecType";
import License from "../../model/License";

function getDefaultLicense(license: object | string | undefined): License |  null {
    if (typeof license === "string") {
        if (license !== "") {
            return JSON.parse(license)
        } else {
            return null;
        }
    } else {
        return license as License;
    }
}

interface DetailsViewProps {
    keycloakReady: boolean;
    showDialog: Function;
}

function DetailsView({keycloakReady,  showDialog}: DetailsViewProps): JSX.Element {
    const {keycloak} = useKeycloak();
    const params = useParams();
    const code = params["code"];

    const projQ = useGetProjectQuery({
        token: keycloak.token,
        code: code ?? ""
        },
        {
            skip: !code || !keycloakReady
        }
    )

    const confQ = useGetProjectConfigQuery({
        token: keycloak.token,
        code: code ?? ""
        },
        {
            skip: !code || !keycloakReady || !keycloak.authenticated || projQ.data?.allowedActionsForTheUser?.includes("config") !== true
        }
    );
    const license = getDefaultLicense(confQ.data?.defaultLicense);
    // console.log(projQ);
    if (!code) {
        return <ErrorView message="Unable to get the project code, can't obtain project's details" />;
    } else if (projQ.isLoading || confQ.isLoading) {
        return <LoadingView fullMessage="Loading project details, please wait..."/>
    } else if (projQ.isError) {
        return <ErrorView message={Util.getError(projQ.error).message} />
    }  else if (confQ.isError) {
        return <ErrorView message={Util.getError(confQ.error).message} />
    } else if (projQ.data) {
        return <div className="d-flex flex-column flex-wrap p-2 gap-3 p-2">
                <h3>
                    {projQ.data.name}
                    {
                        keycloak.authenticated && projQ.data.editablePropertiesByTheUser.includes("name") 
                            ? <GenericFieldEdit oldValue={projQ.data.name} field="name" 
                                    keycloakReady={keycloakReady} 
                                    fieldDisplay="project's name"
                                    showDialog={showDialog}
                                    patchMutation={usePatchProjectMutation}
                                    patchExternalFields={{
                                        code: projQ.data.code
                                    }}
                                    spec={BodyFactorySpecType.PROJECT}/>
                            : <></>
                    }
                </h3>
                <div className="d-flex flex-row flex-wrap p-2 gap-3 p-2">
                    <div className="d-flex flex-column flex-wrap p-2 gap-3 p-2">
                        <div className="justify-content-center align-content-center" 
                                style={{"height": "18rem", "width": "18rem", "maxHeight": "18rem", "maxWidth": "18rem"}}>
                            {
                                projQ.data.logoUrl 
                                    ? <Image src={projQ.data.logoUrl} style={{"width": "18rem", "maxHeight": "18rem", "maxWidth": "18rem"}}/>
                                    : <NoLogoAvailable />
                            }
                        </div>                     
                        {
                            keycloak.authenticated && projQ.data.editablePropertiesByTheUser.includes("logo") 
                                ? <GenericFieldEdit oldValue={""} field="logoUrl" 
                                    keycloakReady={keycloakReady} 
                                    fieldDisplay="the logo (paste the URL to the  new logo in the input)"
                                    showDialog={showDialog}
                                    patchMutation={usePatchProjectMutation}
                                    patchExternalFields={{
                                        code: projQ.data.code
                                    }}
                                    spec={BodyFactorySpecType.PROJECT}>
                                        {projQ.data.logoUrl ? "Edit logo" : "Upload logo"}
                                    </GenericFieldEdit>
                                
                                
                                // <Button variant="link">{projQ.data.logoUrl 
                                //     ? "Edit logo" : "Upload logo"}</Button>
                                : <></>
                        }
                    </div>
                    <div className="d-flex flex-column flex-wrap">
                        <span><b>Project code: </b>{projQ.data.code}</span>
                        {
                            projQ.data.externalUrl 
                                ? <span>
                                        <b>External URL: </b>
                                        <a href={projQ.data.externalUrl ?? "#"}>{projQ.data.externalUrl}</a>
                                        {
                                            keycloak.authenticated 
                                                    && projQ.data.editablePropertiesByTheUser.includes("externalUrl") 
                                                ? <GenericFieldEdit oldValue={projQ.data.externalUrl ?? ""} field="externalUrl" 
                                                        keycloakReady={keycloakReady} 
                                                        fieldDisplay="project's external URL"
                                                        showDialog={showDialog}
                                                        patchMutation={usePatchProjectMutation}
                                                        patchExternalFields={{
                                                            code: projQ.data.code
                                                        }}
                                                        spec={BodyFactorySpecType.PROJECT}/>
                                                : <></>
                                        }
                                    </span>
                                : <></>
                        }
                        {
                            projQ.data.allowedActionsForTheUser.includes("config") 
                                ? <>
                                    <span><b>Contact info: </b>{confQ.data?.defaultContactInfo ?? ""}</span>
                                    <span><b>License: </b>{
                                                        license ? (
                                                            license.url ? <a href={license.url}>{license.title ?? license.url}</a>
                                                                    : license.title ?? ""
                                                            )
                                                            : ""
                                                    }
                                    </span>
                                    <span><b>Zenodo author: </b>{confQ.data?.zenodoAuthor}</span>
                                    <span><b>Zenodo community: </b>{confQ.data?.zenodoCommunity}</span>
                                    <span><b>Zenodo grant: </b>{confQ.data?.zenodoGrant}</span>
                                    <Link to={UrlFactory.projectConfigEdit(code)}>Edit project configuration</Link>                             
                                </> 
                                : <></>
                        }
                        

                        <Link to={`/datasets?invalidated=false&project=${projQ.data.code}`}>List of Datasets</Link>                   
                    </div>
                    
                </div>
                <div className="w-100">
                    <b className="w-100">Description:</b>
                    {
                        keycloak.authenticated 
                                && projQ.data.editablePropertiesByTheUser.includes("shortDescription") 
                            ? <GenericFieldEdit oldValue={projQ.data.shortDescription ?? ""} field="shortDescription" 
                                    keycloakReady={keycloakReady} 
                                    fieldDisplay="project's description"
                                    showDialog={showDialog}
                                    patchMutation={usePatchProjectMutation}
                                    patchExternalFields={{
                                        code: projQ.data.code
                                    }}
                                    spec={BodyFactorySpecType.PROJECT}/>
                            : <></>
                    }
                    <div className="w-100 ms-4">{projQ.data.shortDescription ?? ""}</div>
                </div>
                {
                    projQ.data.allowedActionsForTheUser.includes("config") 
                            && confQ.data !== undefined
                        ? <div className="w-100">
                            <b className="w-100">Zenodo Token:</b>
                            <div className="w-100 ms-4">{confQ.data.zenodoAccessToken ?? ""}</div>
                        </div>
                        : <></>
                }
            </div>;
    } else {
        return <Alert variant="secondary">
                No projects available.
            </Alert>;
    }
}

export default DetailsView;