import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import License from "../../model/License";
import { useGetLicensesQuery } from "../../service/singledata-api";
import { Alert, Form } from "react-bootstrap";
import LoadingView from "../common/LoadingView";
import { useKeycloak } from "@react-keycloak/web";
import ProjectConfig from "../../model/project/ProjectConfig";
import ErrorView from "../common/ErrorView";
import Util from "../../Util";

const customEmptyLic: License = {} as License;

interface ProjectConfigEditorProps {
    setConfig?: Function;
    config?: ProjectConfig | undefined;
}

function ConfigEditorCommon({setConfig, config}: ProjectConfigEditorProps): JSX.Element {

    const [license, setLicense] = useState<License>(config?.defaultLicense ?? customEmptyLic);

    const [localConfig, setLocalConfig] = useState<ProjectConfig>(config ?? {
        defaultLicense: customEmptyLic
    });
    

    const updConf = useCallback((key: string, value: string | License) => {
            setLocalConfig(prev => {
                    return {...prev, [key]: value}
                });
            if (setConfig) {
                setConfig({...localConfig, [key]: value});
            }
        }, [localConfig, setLocalConfig]);
    const {keycloak} = useKeycloak();

    const {data, isLoading, error, isError} = useGetLicensesQuery({
            token: keycloak.token
        }, 
        {
            skip: !keycloak.token
        }
    );

    const isCustomLicense = data ? (data.find(e => e.title === license.title && e.url === license.url) === undefined) : false;
    // useEffect(() => {
    //     if (data && data.length > 0 && license === customEmptyLic) {
    //         const l =  JSON.stringify(data[0]);
    //         setLicense(l);
    //         updConf("defaultLicense", l);
    //     }
    // },[data, setLicense,updConf, localConfig]);
    const onLicChange = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const lc: License = JSON.parse(e.target.value);
        updConf("defaultLicense", lc);
        setLicense(lc);
    }
    
    if (isLoading) {
        return <LoadingView fullMessage="Loading licenses, please  wait..." />
    } else if (isError) {
        return <ErrorView message={`Error loading licenses: ${Util.getError(error).message}`}/>
    } else if (data) {
        return <>
        <Form.Group className="mb-3" title="Set th contact information for the project like an email for the contact person(s).">
                <Form.Label>Contact Information</Form.Label>
                <Form.Control placeholder="Enter the contact information" 
                    value={localConfig.defaultContactInfo ?? ""}
                    name="defaultContactInfo" 
                    onInput={(e: FormEvent<HTMLInputElement>) => updConf("defaultContactInfo", e.currentTarget.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" title="Set the license. Select '<Custom>' and the leave the fields empty if you don't want to set a license right now.">
                <Form.Label>License</Form.Label>
                
                <Form.Select aria-label="License selector" 
                        value={JSON.stringify(license)}
                        onChange={onLicChange}
                        >
                    {
                        data.map((l: License) => <option key={l.url ?? crypto.randomUUID()} 
                                    value={JSON.stringify({title: l.title, url: l.url})}>
                                {l.title}
                            </option>)
                    } 
                    <option key="custom-license" value={JSON.stringify(isCustomLicense ? license : customEmptyLic)}>
                        {"<Custom>"}
                    </option>
                </Form.Select>
                {
                    license === customEmptyLic || isCustomLicense
                        ? <div className="w-100 ms-4 bg-light mt-4 pt-2 pb-2">
                            <Form.Group className="ms-2 mb-3 ">
                                <Form.Label>Custom License Title</Form.Label>
                                <Form.Control placeholder="Enter the license title" 
                                    name="defaultLicenseTitle"
                                    defaultValue={license.title}
                                    onInput={(e: FormEvent<HTMLInputElement>) => {
                                        updConf("defaultLicense",
                                            {
                                                url: localConfig.defaultLicense?.url ?? "", 
                                                title: e.currentTarget.value}
                                        );
                                    }}
                                    />
                             </Form.Group>
                            <Form.Group className="ms-2 mb-3">
                                <Form.Label>Custom License URL</Form.Label>
                                <Form.Control placeholder="Enter the license URL" 
                                    name="defaultLicenseUrl" 
                                    defaultValue={license.url}
                                    onInput={(e: FormEvent<HTMLInputElement>) => {
                                        updConf("defaultLicense",{
                                                title: localConfig.defaultLicense?.title ?? "", 
                                                url: e.currentTarget.value}
                                        );
                                    }}
                                    />
                             </Form.Group>
                        </div>
                        : <></>
                }
                
            </Form.Group>


            <Form.Group className="mb-3" title="Set the access token for Zenodo if there is one.">
                <Form.Label>Zenodo Access Token</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter the Zenodo Access Token" 
                    name="zenodoAccessToken"
                    value={localConfig.zenodoAccessToken ?? ""}
                    onInput={(e: FormEvent<HTMLInputElement>) => updConf("zenodoAccessToken", e.currentTarget.value)}
                    />
            </Form.Group>



            <Form.Group className="mb-3" title="Set the author for Zenodo if there is one.">
                <Form.Label>Zenodo Author</Form.Label>
                <Form.Control placeholder="Enter the Zenodo author" 
                    name="zenodoAuthor"
                    value={localConfig.zenodoAuthor ?? ""}
                    onInput={(e: FormEvent<HTMLInputElement>) => updConf("zenodoAuthor", e.currentTarget.value)}
                    />
            </Form.Group>

            <Form.Group className="mb-3" title="Set the Zenodo community if there is one.">
                <Form.Label>Zenodo Community</Form.Label>
                <Form.Control placeholder="Enter the Zenodo community" 
                    name="zenodoCommunity"
                    value={localConfig.zenodoCommunity ?? ""}
                    onInput={(e: FormEvent<HTMLInputElement>) => updConf("zenodoCommunity", e.currentTarget.value)}
                    />
            </Form.Group>


            <Form.Group className="mb-3" title="Set the Zenodo grant ID if there is one.">
                <Form.Label>Zenodo grant</Form.Label>
                <Form.Control placeholder="Enter the Zenodo grant" 
                    name="zenodoGrant"
                    value={localConfig.zenodoGrant ?? ""}
                    onInput={(e: FormEvent<HTMLInputElement>) => updConf("zenodoGrant", e.currentTarget.value)}
                    />
            </Form.Group>
        </>
    } else {
        return <Alert variant="info">Project config not available</Alert>
    }


}

export default ConfigEditorCommon;