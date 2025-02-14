import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useGetProjectConfigQuery, usePutProjectConfigMutation } from "../../service/singledata-api";
import { useKeycloak } from "@react-keycloak/web";
import ErrorView from "../common/ErrorView";
import { useNavigate, useParams } from "react-router-dom";
import {  Button, Form } from "react-bootstrap";
import LoadingView from "../common/LoadingView";
import Util from "../../Util";
import UrlFactory from "../../service/UrlFactory";
import ProjectConfig from "../../model/project/ProjectConfig";
import ConfigEditorCommon from "./ConfigEditorCommon";


function ConfigEditorView():JSX.Element {
    const {keycloak} = useKeycloak();
    const params = useParams();
    const code = params["code"];
    const navigate = useNavigate();
    const [config, setConfig] = useState<ProjectConfig>({});
    const [submitError, setSubmitError] = useState<string>("");

    const [putPrjCnf, {isError: isErrorPutPrjCnf, isLoading: isLoadingPutPrjCnf, error: errorPutPrjCnf, 
        data: dataPutPrjCnf } ] = usePutProjectConfigMutation();

    const submit = useCallback((e: SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (keycloak.token === undefined) {
                setSubmitError("Please authenticate to submit a new project.");
                return;
            }
            if (code === undefined) {
                setSubmitError("Unable to obtain the project code from the URL."); 
                return;
            }
            putPrjCnf({
                projectConfig: config,
                token: keycloak.token,
                code
            });
            
        }, [putPrjCnf, config, keycloak.token, setSubmitError]);

    useEffect(() => {
        if (code && dataPutPrjCnf) {
            navigate(UrlFactory.projectDetails(code))
        }
    }, [isErrorPutPrjCnf, setSubmitError, errorPutPrjCnf, navigate, dataPutPrjCnf, code]);

    const { data, isLoading, error, isError } = useGetProjectConfigQuery({
            token: keycloak.token,
            code: code ?? ""
        },
        {
            skip: keycloak.token === undefined || code === undefined
        });
    
    

    if (!code) {
        return <ErrorView message="Unable to get the project code, can't obtain project's config" />;
    } else if (!keycloak.token) {
        return <ErrorView message="You must authenticate before accessing this section." />;
    } else  if (isLoading) {
        return <LoadingView fullMessage="Loading project details, please wait..."/>
    } else if (isError) {
        return <ErrorView message={Util.getError(error).message} />
    } else {
        return <>
            {
                isLoadingPutPrjCnf ? <LoadingView fullMessage="Submitting project configuration, please wait..." /> :<></>
            }
            {
                submitError ? <ErrorView  message={`Error submitting the new project configuration: ${submitError}`} /> :<></>
            }
            {
                isErrorPutPrjCnf ? <ErrorView  message={`Error submitting the new project configuration: ${Util.getError(errorPutPrjCnf).message}`} /> :<></>
            }
            <Form className="ms-2 me-2" onSubmit={submit}>

                <ConfigEditorCommon setConfig={setConfig} config={data} />

                <Button variant="primary" type="submit" className="ms-4 mt-4 me-2">
                    Submit
                </Button>

                <Button variant="secondary"  className="mt-4" onClick={() => navigate(UrlFactory.projectDetails(code))}>
                    Cancel
                </Button>
            </Form>
        </>
    }
}

export default ConfigEditorView;


