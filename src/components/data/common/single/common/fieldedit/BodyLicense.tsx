import { Button, FormControl } from "react-bootstrap";
import React, { useState, Fragment, FormEvent, useEffect, useCallback } from "react";

//import licenses from "../../../../../../licenses.json";
import LoadingData from "../../../../../../model/LoadingData";
import License from "../../../../../../model/License";
import { useKeycloak } from "@react-keycloak/web";
import DataManager from "../../../../../../api/DataManager";
import Util from "../../../../../../Util";
import ErrorView from "../../../../../common/ErrorView";
import LoadingView from "../../../../../common/LoadingView";

interface BodyLicenseProps {
  oldValue: License;
  updValue: Function;
  keycloakReady: boolean;
  dataManager: DataManager;
}

function BodyLicense(props: BodyLicenseProps) {

    const [value, setValue] = useState(props.oldValue);

    const isCustomf = useCallback((licenses: Array<License>): boolean => {
      return licenses.findIndex(el => el["title"] === value["title"] && el["url"] === value["url"]) === -1;
    }, [value]);

    const [licenses, setLicenses] = useState<LoadingData<License[]>>({
      statusCode: -1,
       loading: false,
       error: null,
       data: []

    });
    const isCustom = isCustomf(licenses.data ?? []);
    const [customValue, setCustomValue] = useState<License>(isCustom ? value : {title: "", url: ""});
    const {keycloak} = useKeycloak();
    const updValue = (newVal: License) => {
      setValue((prev: License) => {
        return {...prev, ...newVal};
      });
      props.updValue(newVal);
    }
    const updCustomValue = (e: FormEvent<HTMLInputElement>, field: string) => {
      e.preventDefault();
      const t = e.target as HTMLInputElement;
      setCustomValue({...customValue, [field]: t.value});
      updValue({...value, [field]: t.value});
    };

    useEffect(() => {
      if (props.keycloakReady && keycloak.authenticated) {
        setLicenses( prevValues => {
           return { ...prevValues, loading: true, error: null, data: [], statusCode: -1 }
        });
        props.dataManager.getLicenses(keycloak.token ?? "")
          .then(
            (xhr: XMLHttpRequest) => {
              let  data: License[] = JSON.parse(xhr.response) as License[];
              setLicenses( prevValues => {
                return { ...prevValues, loading: false, error: null, data, statusCode: xhr.status }
              });
              const cv = isCustomf(data) ? value : {title: "", url: ""};
              setCustomValue(cv);
            },
            (xhr: XMLHttpRequest) => {
                const error = Util.getErrFromXhr(xhr);
                setLicenses( prevValues => {
                    return { ...prevValues, loading: false, error, data: [], statusCode: xhr.status}
                });
            });
        }
  }, [props.keycloakReady, props.dataManager, setLicenses, keycloak.token, setCustomValue]);

    if (licenses.error) {
      return <ErrorView message={`Error loading licenses: ${licenses.error.title}`}/>;
    } else {
      if (licenses.loading) {
        return <LoadingView fullMessage="Loading licenses, please wait" />
      } else {
        return  <div className="mb-3">
        <Button title="Restore Initial value" variant="link" onClick={(e) => updValue(props.oldValue)}>Restore original</Button><br />
        <select onChange={(e) => {e.preventDefault();updValue(JSON.parse(e.target.value));}} 
            value={isCustom ? JSON.stringify(customValue) :  JSON.stringify(value) }>
          <option key="-1" value={JSON.stringify(customValue)}>Custom License</option>
          {licenses.data?.map((el, idx) => <option key={btoa(el.title)} value={JSON.stringify(el)}>{el.title}</option>)}
        </select>
        {
          isCustom ?
              <div className="mt-4">
                <FormControl className="w-100"
                  placeholder="Title"
                  aria-label="License title"
                  title="Set the custom license's title"
                  value={customValue.title} onInput={(e: FormEvent<HTMLInputElement>) => updCustomValue(e, "title")}
                />
                  <FormControl className="mt-2 w-100"
                    placeholder="URL"
                    aria-label="License url"
                    title="Set the custom license's URL"
                    value={customValue.url} onInput={(e: FormEvent<HTMLInputElement>) => updCustomValue(e, "url")}
                  />
              </div>
            : <Fragment />
        }
      </div>;
      }
    }

    
}

export default BodyLicense;