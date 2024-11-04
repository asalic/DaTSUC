import { FormControl } from "react-bootstrap";
import React, { Fragment, FormEvent, useCallback, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";

//import licenses from "../../../../../../licenses.json";
import License from "../../../../../../model/License";
import ErrorView from "../../../../../common/ErrorView";
import LoadingView from "../../../../../common/LoadingView";
import { useGetLicensesQuery } from "../../../../../../service/singledata-api";
import { useState } from "react";
import SingleDataType from "../../../../../../model/SingleDataType";
// import PatchMessage from "../../../../../common/PatchMessage";

interface BodyLicenseProps {
  keycloakReady: boolean;
  singleDataId: string;
  oldValue: License;
  updValue: Function;
  singleDataType: SingleDataType;
  //patchStatus:any;

}

function BodyLicense(props: BodyLicenseProps) {


  const { keycloak } = useKeycloak();
  const [value, setValue] = useState<License>(props.oldValue);

    const { data: licenses, error: licensesError, isLoading: licensesIsLoading } = useGetLicensesQuery({
      token: keycloak.token
    });
    // const [patchSingleData, {isError: isPatchError, isLoading: isPatchLoading, error: patchError } ] = usePatchSingleDataMutation();

    const isCustom = useCallback((): boolean => {
      if (licenses) {
        return licenses.findIndex(el => el["title"] === value["title"] 
          && el["url"] === value["url"]) === -1;
      } else {
        return false;
      }
      
    }, [value, licenses]);

    const [customValue, setCustomValue] = useState<License>({title: "", url: ""});
    useEffect(() => {
      if (licenses && isCustom()) {
        setCustomValue(value);
      }
    }, [licenses, isCustom, setCustomValue])

    const updValue = (newVal: License) => {
      setValue((prev: License) => {
        return {...prev, ...newVal};
      });
      props.updValue(newVal);
      // patchSingleData({
      //   token: keycloak.token,
      //   id: props.singleDataId, 
      //   property: "license", 
      //   value: JSON.stringify(value), 
      //   singleDataType: props.singleDataType
      // })
    }
    const updCustomValue = (e: FormEvent<HTMLInputElement>, field: string) => {
      e.preventDefault();
      const t = e.target as HTMLInputElement;
      setCustomValue({...customValue, [field]: t.value});
      updValue({...value, [field]: t.value});
    };

    if (licensesError) {
      return <ErrorView message={`Error loading licenses: ${licensesError.message ?? ""}`}/>;
    } else {
      if (licensesIsLoading) {
        return <LoadingView fullMessage="Loading licenses, please wait" />
      } else {
        return  <div className="mb-3">

          <select onChange={(e) => {e.preventDefault();updValue(JSON.parse(e.target.value));}} 
              value={isCustom() ? JSON.stringify(customValue) :  JSON.stringify(value) }>
            <option key="-1" value={JSON.stringify(customValue)}>Custom License</option>
            {licenses?.map((el: License) => <option key={btoa(el.title ?? crypto.randomUUID())} value={JSON.stringify(el)}>{el.title}</option>)}
          </select>
          {
            isCustom() ?
                <div className="mt-4">
                  <FormControl className="w-100"
                    placeholder="Title"
                    aria-label="License title"
                    title="Set the custom license's title"
                    value={customValue.title ?? ""} onInput={(e: FormEvent<HTMLInputElement>) => updCustomValue(e, "title")}
                  />
                    <FormControl className="mt-2 w-100"
                      placeholder="URL"
                      aria-label="License url"
                      title="Set the custom license's URL"
                      value={customValue.url ?? ""} onInput={(e: FormEvent<HTMLInputElement>) => updCustomValue(e, "url")}
                    />
                </div>
              : <Fragment />
          }
        </div>;
      }
  }

    
}

export default BodyLicense;