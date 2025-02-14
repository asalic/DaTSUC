import { Alert, Button, Card } from "react-bootstrap";
import React from "react";
import ProjectListItem from "../../model/project/ProjectListItem";
import GetProjectsPurpose from "../../model/project/GetProjectsPurpose";
import { useGetProjectsQuery } from "../../service/singledata-api";
import { useKeycloak } from "@react-keycloak/web";
import LoadingView from "../common/LoadingView";
import ErrorView from "../common/ErrorView";
import Util from "../../Util";
import { useNavigate } from "react-router-dom";
import UrlFactory from "../../service/UrlFactory";
import NoLogoAvailable from "../common/NoLogoAvailable";
import ProjectList from "../../model/project/ProjectList";


interface MainViewGridProps {
    keycloakReady: boolean;
}

function MainViewGrid({keycloakReady}: MainViewGridProps): JSX.Element {

    const {keycloak} = useKeycloak();
    const navigate = useNavigate();

    const { data, isLoading, error, isError } = useGetProjectsQuery({
        token: keycloak.token,
        purpose: GetProjectsPurpose.PROJECT_LIST
        },
        {
            skip: !keycloakReady
        }
    )

    if (isLoading || !keycloakReady) {
        return <LoadingView fullMessage="Loading list of projects, please wait..."/>
    } else if (isError) {
        return <ErrorView message={Util.getError(error).message} />
    } else if (data) {
        const prjLstObj = data as ProjectList;
        const dt = prjLstObj.list;
        // console.log(Config.datasetService.api + dt[0]?.logoUrl)
        return <div className="d-flex flex-row flex-wrap p-2 gap-4">
            {
                dt.map((e: ProjectListItem) => 
                    <Card key={e.code} border="secondary" style={{ width: '18rem', minWidth: '18rem'}}>
                        <div style={{ height: '14rem', minHeight: '14rem'}} className="w-100 h-100 d-flex flex-wrap flex-row justify-content-center align-content-center">
                        {
                            e.logoUrl ? <Card.Img variant="top"
                                    src={e.logoUrl} />
                                : <NoLogoAvailable />
                        }
                        </div>
                        <Card.Body className="bg-light" >
                            <Card.Title>{e.name}</Card.Title>
                            <Button variant="primary" onClick={() => navigate(UrlFactory.projectDetails(e.code))}>Details</Button>
                        </Card.Body>
                    </Card>
                )
            }
        </div>
    } else {
        return <Alert variant="secondary">
                No projects available.
            </Alert>;
    }
}

export default MainViewGrid;