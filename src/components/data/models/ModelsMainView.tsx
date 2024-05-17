import React from "react";
import DataManager from "../../../api/DataManager";

interface ModelsMainViewProps {
    keycloakReady: boolean;
    dataManager: DataManager;
    postMessage: Function;
    activeTab?: string;
  }
  
function ModelsMainView(props: ModelsMainViewProps) {

  return <h3>Under construction, stay tuned!</h3>

}

export default ModelsMainView;