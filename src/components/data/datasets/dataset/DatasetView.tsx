import React, { useEffect, useMemo, useState } from "react";
import DataManager from "../../../../api/DataManager";
import SingleDataView from "../../common/single/main/SingleDataView";
import SingleItemTab from "../../../../model/SingleItemTab";
import { useKeycloak } from "@react-keycloak/web";
import LoadingData from "../../../../model/LoadingData";
import DatasetStudiesView from "./studies/DatasetStudiesView";
import DetailsView from "../../common/single/details/DetailsView";
import HistoryView from "../../common/single/history/HistoryView";
import AccessHistoryView from "../../common/single/access/AccessHistoryView";
import AccessControlListView from "../../common/single/acl/AccessControlListView";
import Util from "../../../../Util";
import Message from "../../../../model/Message";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingError from "../../../../model/LoadingError";
import { showDialogAppDashhboard } from "../../common/single/common/Operations";
import Dataset from "../../../../model/Dataset";


DatasetView.TAB_STUDIES = "studies";

interface DatasetViewProps {
    dataManager: DataManager;
    postMessage: Function;
    showDialog: Function;
    keycloakReady: boolean;
    showdDlgOpt?: string | null;
    activeTab: string;
  
}
  
function DatasetView(props: DatasetViewProps) {
    const { keycloak } = useKeycloak();
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [allValues, setAllValues] = useState<LoadingData<Dataset>>({
        loading: false,
         error: null,
         data: null,
         statusCode: -1
      });
    
    const datasetId: string | undefined = params["singleDataId"];


    const getDataset = //useCallback(
      (token: string | null | undefined, datasetId: string) => {
        setAllValues(  (prevValues: LoadingData<Dataset>) => {
          return { ...prevValues, loading: true, error: null, data: null, status: -1 }
          });
        props.dataManager.getDataset(token, datasetId)
          .then(
          (xhr: XMLHttpRequest) => {
              let data = JSON.parse(xhr.response);
              //console.log("[TMP] license set");
              if (data["license"] === null ||  data["license"] === undefined ||  data["license"].length === 0) {
              data["license"] = {title: "", url: ""};
              }
              if (data["licenseUrl"] !== null &&  data["licenseUrl"] !== undefined && data["licenseUrl"].length !== 0) {
              data["license"] = JSON.parse(data["licenseUrl"].replace(/'/g,"\""));//(typeof data["licenseUrl"] === "object" ? data["licenseUrl"] : JSON.parse(data["licenseUrl"])); //data["licenseUrl"].title;//JSON.parse(data["licenseUrl"]);
              }
              setAllValues(  (prevValues: LoadingData<Dataset>) => {
              return { ...prevValues, loading: false, error: null, data: data, status: xhr.status }
              });
          },
          (xhr: XMLHttpRequest) => {
              const error: LoadingError = Util.getErrFromXhr(xhr);
              if (xhr.status === 401) {
              keycloak.login();
              } else {
              props.postMessage(new Message(Message.ERROR, error.title, error.text));
                  setAllValues( (prevValues: LoadingData<Dataset>) => {
                  return { ...prevValues, data: null, loading: false, error: error, status: xhr.status}
                  });
              }
          });
      }//, [props.dataManager, keycloak, props.postMessage, props.keycloakReady, setAllValues]);


    const patchDataset = (token: string | null | undefined, datasetId: string, field: string, value: string | null) => {
        props.dataManager.patchDataset(token, datasetId, field, value)
        .then(
        (xhr: XMLHttpRequest) => {
            getDataset(token, datasetId);
            // setAllValues( prevValues => {
            //   let data = JSON.parse(JSON.stringify(prevValues));
            //   data[field] = value;
            //    return { ...prevValues, isLoading: false, isLoaded: true, error: null, data, status: xhr.status }
            // });
        },
        (xhr: XMLHttpRequest) => {
            const error = Util.getErrFromXhr(xhr);
            props.postMessage(new Message(Message.ERROR, error.title, error.text));
            // setAllValues( prevValues => {
            //    return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: Util.getErrFromXhr(xhr), status: xhr.status }
            // });
        });
        };



  useEffect(() => {
    if (props.keycloakReady && datasetId) {
      console.log(datasetId);
      //console.log(`props.showdDlgOpt ${props.showdDlgOpt}`);
      getDataset(keycloak.token, datasetId);
      if (props.showdDlgOpt === SingleDataView.SHOW_DLG_APP_DASHBOARD) {
        if (keycloak.authenticated) {
          showDialogAppDashhboard(datasetId, props.showDialog, () => {
            navigate(Util.popPath(location.pathname));
          },
          keycloak?.idTokenParsed?.["preferred_username"]
          )
        } else {
          keycloak.login();
        }
      }
    } 
    // else {
    //   getDataset(null, datasetId);
    // }
  }, [props.keycloakReady, keycloak, showDialogAppDashhboard, navigate, props.showdDlgOpt]);

    const tabs: SingleItemTab[] = useMemo(() => {
        const result: SingleItemTab[] = [{
            eventKey: "details",
            title: "Details",
            view: <DetailsView patchDataset={patchDataset} showDialog={props.showDialog} getDataset={getDataset}
                data={allValues} keycloakReady={props.keycloakReady} postMessage={props.postMessage} 
                dataManager={props.dataManager}/>
        }]

      if (keycloak.authenticated) {
        result.push({
                eventKey: "studies",
                title: "Studies",
                view: <DatasetStudiesView keycloakReady={props.keycloakReady}
                    postMessage={props.postMessage} dataManager={props.dataManager}/>
            },
            {
                eventKey: "history",
                title: "History",
                view: <HistoryView keycloakReady={props.keycloakReady} postMessage={props.postMessage} 
                    dataManager={props.dataManager}/>

            }
        );
        if (allValues?.data?.["allowedActionsForTheUser"].includes("viewAccessHistory")) {
            result.push({
                eventKey: "access",
                title: "Access",
                view: <AccessHistoryView keycloakReady={props.keycloakReady} postMessage={props.postMessage} 
                    dataManager={props.dataManager}/>
            })
        }
        if (allValues?.data?.["allowedActionsForTheUser"].includes("manageACL")) {
            result.push({
                eventKey: "acl",
                title: "ACL",
                view: <AccessControlListView dataset={allValues.data} keycloakReady={props.keycloakReady} postMessage={props.postMessage}
                    dataManager={props.dataManager}/>

            })
        }
      }
      return result;
    }, [keycloak.authenticated, props, allValues])

    return <SingleDataView dataManager={props.dataManager} postMessage={props.postMessage} 
        showDialog={props.showDialog} keycloakReady={props.keycloakReady}
        showdDlgOpt={props.showdDlgOpt} activeTab={props.activeTab}
        tabs={tabs} patchSingleData={patchDataset} singleData={allValues}
    />;

}

export default DatasetView;