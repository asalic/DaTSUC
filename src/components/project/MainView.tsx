
import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Button } from "react-bootstrap";
import MainViewGrid from "./MainViewGrid";
import GetProjectsPurpose from "../../model/project/GetProjectsPurpose";
import { useGetProjectsQuery } from "../../service/singledata-api";
import ErrorView from "../common/ErrorView";
import Util from "../../Util";
import { useNavigate } from "react-router-dom";
import UrlFactory from "../../service/UrlFactory";


interface MainViewProps {
    keycloakReady: boolean;
}

function MainView({keycloakReady}: MainViewProps): JSX.Element {
    const navigate = useNavigate();
    const {keycloak} = useKeycloak();
    const { data, error, isError } = useGetProjectsQuery({
        token: keycloak.token,
        purpose: GetProjectsPurpose.PROJECT_LIST
        },
        {
            skip: !keycloak.authenticated
        }
    );
    const canCreateProj = data !== undefined && "allowedActionsForTheUser" in data ? 
            data.allowedActionsForTheUser.includes("create")
        :  false;
    console.log(data);
    return <div className="d-flex flex-column p-2 w-100">

        {
            isError 
                ? <ErrorView message={"Unable to  check  if you are allowed to  create new projects: " 
                    + Util.getError(error).message} />
                : <></>
        }
        {
            keycloak.authenticated && canCreateProj
                ? <div className="w-100 mb-4  ms-4">
                    <Button variant="primary" onClick={() => navigate(UrlFactory.projectNew())}>New Project</Button>
                </div> 
                : <></>
        }
        <MainViewGrid keycloakReady={keycloakReady} />
    </div>
   
}

export default MainView;