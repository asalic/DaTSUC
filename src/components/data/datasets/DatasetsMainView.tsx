import React from "react";
import DataManager from "../../../api/DataManager";
import MainView from "../common/main/MainView";

interface DatasetsMainViewProps {
    keycloakReady: boolean;
    dataManager: DataManager;
    postMessage: Function;
    activeTab?: string;
  }
  
function DatasetsMainView(props: DatasetsMainViewProps) {

  return <MainView  keycloakReady={props.keycloakReady} dataManager={props.dataManager} postMessage={props.postMessage} activeTab={props.activeTab}/>

}

export default DatasetsMainView;