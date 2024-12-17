import { useKeycloak } from "@react-keycloak/web";
import React, { useState, useEffect, useCallback } from "react";
import { Placeholder } from "react-bootstrap";
import Select, { ActionMeta, Props, GroupBase, SingleValue } from 'react-select';
import UpgradableDataset from "../../../../../../model/UpgradableDataset";
import { useGetUpgradableDatasetsQuery } from "../../../../../../service/singledata-api";
import ErrorView from "../../../../../common/ErrorView";
import SingleDataType from "../../../../../../model/SingleDataType";
import SingleDataFactory from "../../../../../../api/SingleDataFactory";

interface SelOpt {
    value: string;
    label: string;

}

// interface UpgradableDataset {
//     id: string;
//     name: string;
// }

// interface DataState extends LoadingData<UpgradableDataset[] | null | undefined> {
//     oldValue: UpgradableDataset | null | undefined;

// }

function toSelId(val: UpgradableDataset): SelOpt {
    return {value: val.id, label: `${val.name} (${val.version}) (${val.id})`}
}

function CustomSelect<
  Option = SelOpt,
  IsMulti extends boolean = false,
  Group extends GroupBase<SelOpt> = GroupBase<SelOpt>
>(props: Props<SelOpt, IsMulti, Group>) {
  return (
    <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}

interface BodyIdProps {
    updValue: Function;
    keycloakReady: boolean;
    oldValue: string | null;
    singleDataType: SingleDataType;
}

function BodyId(props: BodyIdProps) {
    // const [dataState, setDataState] = useState<DataState>({
    //     oldValue: null,
    //     loading: true,
    //      error: null,
    //      data: null,
    //      statusCode: null
    //   });
    // const [oldValue, setOldValue] = useState(props.oldValue);
      
    const [selectedOption, setSelectedOption] = useState<SelOpt | null>(null);
    const { keycloak } = useKeycloak();

    const { data, isLoading, error, isError } = useGetUpgradableDatasetsQuery({token: keycloak.token});

    const updSelectedOption = useCallback((newVal: SingleValue<SelOpt>, action?:  ActionMeta<SelOpt> | null) => {
        console.log(action);
        if (action && action.action === "clear") {
            props.updValue(null);
        } else {
            if (newVal) {
                props.updValue(newVal.value);
            }
        }
        setSelectedOption(newVal);//toSelId(newVal));
      }, [setSelectedOption, props.updValue]);

    useEffect(() => {
        if (data && !isError) {
            // let ov: UpgradableDataset | null | undefined = null;
            if (props.oldValue) {
                const sel = data.find((e: UpgradableDataset) => e.id === props.oldValue);
                if (sel) {
                    setSelectedOption(toSelId(sel));
                }
                // ov = sel;
            }
            // setOldValue(JSON.stringify(ov));
        }
        
    }, [data, isError, error]);

    // useEffect(() => {
    //     if (props.keycloakReady && keycloak.authenticated) { 
    //         props.dataManager.getUpgradableDatasets(keycloak.token)
    //             .then((xhr: XMLHttpRequest) => {
    //                     const data: UpgradableDataset[] = JSON.parse(xhr.response) as UpgradableDataset[];
    //                     let oldValue: UpgradableDataset | null | undefined = null;
    //                     if (props.oldValue) {
    //                         const sel = data.find((e: UpgradableDataset) => e.id === props.oldValue);
    //                         if (sel) {
    //                             setSelectedOption(toSelId(sel));
    //                         }
    //                         oldValue = sel;
    //                     }
    //                     setDataState( prevValues => {
    //                         return { ...prevValues, data, oldValue, loading: false, error: null, statusCode: xhr.status}
    //                     });
    //                 }, 
    //             (xhr: XMLHttpRequest) => setDataState( prevValues => {
    //                 return { ...prevValues, data: null, loading: false, error: Util.getErrFromXhr(xhr), oldValue: null, statusCode: xhr.status}
    //             }))

    //     }

    // }, [props.keycloakReady, keycloak.authenticated]);
    if (isError) {
        return <ErrorView message={`Error loading upgradable datasets: ${error.message ?? ""}`} />
    } else if (isLoading) {
        return <Placeholder className="mb-3" as="div" animation="glow">
            <Placeholder as="a" xs={2}/> <br />
            <Placeholder as="select" className="w-100" />
        </Placeholder>
    } else {
        return (<div className="ms-2 me-2">
                Select from datasets created and released by you (chosen dataset's next version is updated automatically when you release this dataset). 
                <br /> 
                {/* {   
                    oldValue ?
                        <Button title="Restore Initial value" variant="link" 
                                onClick={(e) => oldValue ? updSelectedOption(toSelId(oldValue ? JSON.parse(oldValue) : null)) : console.log("none")}>
                            Restore original</Button> : <Fragment />
                }<br /> */}
                <p  className="mt-4">
                    Available {SingleDataFactory.getTypeName(props.singleDataType)}s list (<b>name (version) (ID)</b>)
                    <CustomSelect
                    isClearable
                        isSearchable
                        value={selectedOption}
                        onChange={updSelectedOption}
                        options={data?.map(e => {return toSelId(e);} ) ?? []}
                    />
                </p>
            </div>);
    }

}

export default BodyId;