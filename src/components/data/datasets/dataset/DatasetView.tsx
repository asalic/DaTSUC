import React, { useEffect, useMemo } from "react";
import DataManager from "../../../../api/DataManager";
import SingleDataView from "../../common/single/main/SingleDataView";
import SingleItemTab from "../../../../model/SingleItemTab";
import { useKeycloak } from "@react-keycloak/web";
import DatasetStudiesView from "./studies/DatasetStudiesView";
import DetailsView from "../../common/single/details/DetailsView";
import HistoryView from "../../common/single/history/HistoryView";
import AccessHistoryView from "../../common/single/access/AccessHistoryView";
import AccessControlListView from "../../common/single/acl/AccessControlListView";
import Util from "../../../../Util";
import { useLocation, useNavigate, useParams } from "react-router-dom";
//import LoadingError from "../../../../model/LoadingError";
import { showDialogAppDashhboard } from "../../common/single/common/Operations";
import ResourceNotFoundView from "../../../common/ResourceNotFoundView";
import SingleDataType from "../../../../model/SingleDataType";
import { useGetSingleDataQuery } from "../../../../service/singledata-api";


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
    // const [allValues, setAllValues] = useState<LoadingData<Dataset>>({
    //     loading: false,
    //      error: null,
    //      data: null,
    //      statusCode: -1
    //   });
    const datasetId: string = params["singleDataId"] ?? "";


    // const getDataset = //useCallback(
    //   (token: string | null | undefined, datasetId: string) => {
    //     setAllValues(  (prevValues: LoadingData<Dataset>) => {
    //       return { ...prevValues, loading: true, error: null, data: null, statusCode: -1 }
    //       });
    //     props.dataManager.getDataset(token, datasetId)
    //       .then(
    //       (xhr: XMLHttpRequest) => {
    //           let data = JSON.parse(xhr.response);
    //           //console.log("[TMP] license set");
    //           if (data["license"] === null ||  data["license"] === undefined ||  data["license"].length === 0) {
    //           data["license"] = {title: "", url: ""};
    //           }
    //           if (data["licenseUrl"] !== null &&  data["licenseUrl"] !== undefined && data["licenseUrl"].length !== 0) {
    //           data["license"] = JSON.parse(data["licenseUrl"].replace(/'/g,"\""));//(typeof data["licenseUrl"] === "object" ? data["licenseUrl"] : JSON.parse(data["licenseUrl"])); //data["licenseUrl"].title;//JSON.parse(data["licenseUrl"]);
    //           }
    //           setAllValues(  (prevValues: LoadingData<Dataset>) => {
    //           return { ...prevValues, loading: false, error: null, data: data, statusCode: xhr.status }
    //           });
    //       },
    //       (xhr: XMLHttpRequest) => {
    //         const error: LoadingError = Util.getErrFromXhr(xhr);
    //           if (xhr.status === 401) {
    //             // if (token === null || token === undefined) {
    //             //   keycloak.login();
    //             // } else {
    //               setAllValues( (prevValues: LoadingData<Dataset>) => {
    //                 return { ...prevValues, data: null, loading: false, error, statusCode: xhr.status}
    //               });
    //             //}
    //           } else {
    //             props.postMessage(new Message(Message.ERROR, error.title, error.text));
    //                 setAllValues( (prevValues: LoadingData<Dataset>) => {
    //                 return { ...prevValues, data: null, loading: false, error: error, statusCode: xhr.status}
    //                 });
    //           }
    //       });
    //  }//, [props.dataManager, keycloak, props.postMessage, props.keycloakReady, setAllValues]);


    // const patchDataset = (token: string | null | undefined, datasetId: string, field: string, value: string | null) => {
    //     props.dataManager.patchDataset(token, datasetId, field, value)
    //     .then(
    //     (xhr: XMLHttpRequest) => {
    //         //getDataset(token, datasetId);
    //         dispatch( api.util.invalidateTags(["Dataset", {type: "Dataset", id: dataset.id}]) );
    //         // setAllValues( prevValues => {
    //         //   let data = JSON.parse(JSON.stringify(prevValues));
    //         //   data[field] = value;
    //         //    return { ...prevValues, isLoading: false, isLoaded: true, error: null, data, statusCode: xhr.status }
    //         // });
    //     },
    //     (xhr: XMLHttpRequest) => {
    //         const error = Util.getErrFromXhr(xhr);
    //         props.postMessage(new Message(Message.ERROR, error.title, error.text));
    //         // setAllValues( prevValues => {
    //         //    return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: Util.getErrFromXhr(xhr), statusCode: xhr.status }
    //         // });
    //     });
    //     };

  const { data: dataset } = useGetSingleDataQuery({
      token: keycloak.token,
      id: datasetId,
      singleDataType: SingleDataType.DATASET
    },
    {
      skip: !(props.keycloakReady && datasetId)
    }
  )



  useEffect(() => {
    if (props.keycloakReady && datasetId) {
      console.log(datasetId);
      //console.log(`props.showdDlgOpt ${props.showdDlgOpt}`);
      //getDataset(keycloak.token, datasetId);
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
            view: <DetailsView  showDialog={props.showDialog}
               keycloakReady={props.keycloakReady} singleDataId={datasetId} singleDataType={SingleDataType.DATASET}/>
        }]

      if (keycloak.authenticated) {
        result.push({
                eventKey: "studies",
                title: "Studies",
                view: <DatasetStudiesView datasetId={datasetId} keycloakReady={props.keycloakReady}
                    postMessage={props.postMessage} dataManager={props.dataManager}/>
            },
            {
                eventKey: "history",
                title: "History",
                view: <HistoryView singleDataId={datasetId} keycloakReady={props.keycloakReady} postMessage={props.postMessage} 
                    dataManager={props.dataManager}/>

            }
        );
        if (dataset?.["allowedActionsForTheUser"].includes("viewAccessHistory")) {
            result.push({
                eventKey: "access",
                title: "Access",
                view: <AccessHistoryView singleDataId={datasetId} keycloakReady={props.keycloakReady} postMessage={props.postMessage} 
                    dataManager={props.dataManager}/>
            })
        }
        if (dataset?.["allowedActionsForTheUser"].includes("manageACL")) {
            result.push({
                eventKey: "acl",
                title: "ACL",
                view: <AccessControlListView singleDataId={datasetId} keycloakReady={props.keycloakReady} singleDataType={SingleDataType.DATASET}
                    />

            })
        }
      }
      return result;
    }, [keycloak.authenticated, props, dataset])

    if (datasetId === "") {
      console.error("Dataset ID cannot be empty");
      return <ResourceNotFoundView id={"<datasetId_empty_string>"} />;
    } else {
      return <SingleDataView singleDataType={SingleDataType.DATASET}
          showDialog={props.showDialog} keycloakReady={props.keycloakReady}
          showdDlgOpt={props.showdDlgOpt} activeTab={props.activeTab}
          tabs={tabs}
      />;
    }

}

export default DatasetView;