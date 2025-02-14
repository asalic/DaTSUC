import  React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UrlFactory from "../../service/UrlFactory";
import { usePutProjectMutation } from "../../service/singledata-api";
import { useKeycloak } from "@react-keycloak/web";
import ErrorView from "../common/ErrorView";
import Util from "../../Util";
import LoadingView from "../common/LoadingView";
import ConfigEditorCommon from "./ConfigEditorCommon";
import ProjectConfig from "../../model/project/ProjectConfig";


interface NewProjectViewProps {
    setCreatedSuccessfully?: Function;
}


function NewProjectView({setCreatedSuccessfully}: NewProjectViewProps): JSX.Element {

    const [projectConfig, setConfig] = useState<ProjectConfig>({})
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {keycloak} = useKeycloak();
    const [putProject, {isError, isLoading, error, data } ] = usePutProjectMutation();

    const submit = useCallback((e: SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
                name: { value: string };
                code: { value: string };
                externalUrl: {value: string;}
                logoUrl: {value: string;}
                shortDescription: {value: string;}
              };
            if (keycloak.token) {
                putProject({
                    projectFull: {
                        name: target.name.value,
                        code: target.code.value,
                        externalUrl: target.externalUrl.value,
                        logoUrl: target.logoUrl.value,
                        shortDescription: target.shortDescription.value,
                        projectConfig
                    },
                    token: keycloak.token
                })
            } else {
                setSubmitError("Please authenticate to submit a new project.");
            }
            
        }, [putProject, projectConfig, keycloak.token, setSubmitError]);

    useEffect(() => {
        if (data === true && !isLoading && !isError && submitError === null) {
            if  (submitError) {
                setSubmitError(null);
            }
            navigate(UrlFactory.projectsList());
            if (setCreatedSuccessfully) {
                setCreatedSuccessfully(true);
            }
        }
        
    },  [data, isLoading, isError, submitError])
    console.log(projectConfig);

    return <>
        {
            submitError ? <ErrorView message={submitError} /> : <></>
        }       

        {
            isError ? <ErrorView message={`Error submitting project: ${Util.getError(error).message}`} /> : <></>
        }
        {
            isLoading ? <LoadingView fullMessage="Creating project, please wait..." /> : <></>
        }
        <Form className="ms-2 me-2" onSubmit={submit}>
            <Form.Group className="mb-3" title="Set the code of the project. This field is required.">
                <Form.Label>Code <span className="text-danger">*</span></Form.Label>
                <Form.Control placeholder="Enter project's code"name="code" />
            </Form.Group>
            <Form.Group className="mb-3" title="Set the name of the project">
                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                <Form.Control placeholder="Enter project's name" name="name" />
            </Form.Group>
            <Form.Group className="mb-3" title="Set the external URL of the project">
                <Form.Label>External URL</Form.Label>
                <Form.Control placeholder="Enter a relevant external URL" name="externalUrl" />
            </Form.Group>
            <Form.Group className="mb-3" title="Set the URL of the project's logo. The image will be downloaded by the server.">
                <Form.Label>Logo URL</Form.Label>
                <Form.Control placeholder="Enter a URL for the logo" name="logoUrl"/>
            </Form.Group>


            <Form.Group className="mb-3" title="Set a short description for the project.">
                <Form.Label>Short description</Form.Label>
                <Form.Control as="textarea" rows={3}  placeholder="Enter a short description" name="shortDescription"/>
            </Form.Group>
            
            <ConfigEditorCommon setConfig={setConfig} />

            <div  className="w-100 ms-2">
                <span className="text-danger">*</span> required field
            </div>      

            <Button variant="primary" type="submit" className="ms-4 mt-4 me-2">
                Submit
            </Button>

            <Button variant="secondary"  className="mt-4" onClick={() => navigate(UrlFactory.projectsList())}>
                Cancel
            </Button>
        </Form>
    </>
}

export default NewProjectView;