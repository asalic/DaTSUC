import React from "react";
import DataManager from "../../../api/DataManager";
import MainView from "../common/main/MainView";
import SingleDataType from "../../../model/SingleDataType";

interface DatasetsMainViewProps {
    keycloakReady: boolean;
    dataManager: DataManager;
    postMessage: Function;
    activeTab?: string;
  }
  
function DatasetsMainView(props: DatasetsMainViewProps) {

  return <MainView singleDataType={SingleDataType.DATASET} keycloakReady={props.keycloakReady} dataManager={props.dataManager} postMessage={props.postMessage} activeTab={props.activeTab}/>

}

export default DatasetsMainView;