
import  React, { useState, useCallback, Fragment } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import DatasetView from "./components/data/datasets/dataset/DatasetView";
import DataManager from "./api/DataManager";
import MessageView from "./components/common/MessageView";
import Dialog from "./components/common/Dialog";
import NavbarView from "./components/common/NavbarView";
import Footer from "./components/common/Footer";
import Config from "./config.json";
import FairView from "./components/FairView";
import SupportView from "./components/SupportView"; 
import Message from "./model/Message";
import type DialogSettings from "./model/DialogSettings";
import DialogSize from "./model/DialogSize";
import DatasetsMainView from "./components/data/datasets/DatasetsMainView";
import SingleDataView from "./components/data/common/single/main/SingleDataView";
import ModelsMainView from "./components/data/models/ModelsMainView";

interface Dsv {
  tab: string;
  sdo: string;
  dataManager: DataManager;
  keycloakReady: boolean;
  postMessage: Function;
  showDialog: Function;
}

const dlgDefaultValues: DialogSettings = {
  show: false,
  footer: <Button onClick={() => Dialog.HANDLE_CLOSE()}>Close</Button>,
  title: <>"DEFAULT"</>,
  body: <div>Empty body</div>,
  size: DialogSize.SIZE_LG,
  onBeforeClose: null,
  //data: null,
  scrollable: false
};

function getDSV({tab, sdo, dataManager, keycloakReady, postMessage, showDialog}: Dsv) {
  return (
      <DatasetView showDialog={showDialog} keycloakReady={keycloakReady} 
        postMessage={postMessage} dataManager={dataManager} activeTab={tab} showdDlgOpt={sdo}/>
    );
}

interface AppProps {
  keycloakReady: boolean;
}

function App({keycloakReady}: AppProps) { 
  const [dlgState, setDlgState] = useState<DialogSettings>(dlgDefaultValues);
  //const handleClose = useCallback(() => Dialog.HANDLE_CLOSE());
  const [dataManager] = useState(new DataManager());
  const [message, setMessage] = useState<Message | null>(null);
  const postMessage = useCallback((message: Message | null) => {
    setMessage(message);
  }, []);
  const showDialog = (dlgProps: DialogSettings) => {
    setDlgState({
      ...dlgState,
      show: true,
      footer: dlgProps.footer,
      body: dlgProps.body,
      title: dlgProps.title,
      size: dlgProps.size,
      onBeforeClose: dlgProps.onBeforeClose
    });
  };
  let opt = {
    dataManager,
    keycloakReady: keycloakReady,
    postMessage,
    showDialog,
    sdo: null,
    tab: null
  }

  return (
          
    <Fragment>
            <Dialog settings={dlgState} />
            <MessageView message={message} />
            <NavbarView />
            <div className="flex-grow-1 align-items-stretch ms-3 me-3">

              <br />
              <BrowserRouter basename={Config.basename}>
                <Routes>
                    <Route path="/" element={<Navigate to="/datasets" replace />} />
                    <Route path="/fair" element={<FairView />} />
                    <Route path="/support" element={<SupportView />} />
                    <Route path="/models" element={<ModelsMainView keycloakReady={keycloakReady} 
                        dataManager={dataManager} postMessage={postMessage} />} />
                    <Route path="/datasets" element={<DatasetsMainView keycloakReady={keycloakReady} 
                        dataManager={dataManager} postMessage={postMessage} />} />
                    <Route path="/datasets/:singleDataId/details" 
                      element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady} 
                        postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_DETAILS}/>} />
                    <Route path="/datasets/:singleDataId/details/dlg-app-dashboard" 
                      element={getDSV({...opt, tab: SingleDataView.TAB_DETAILS, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />
                    <Route path="/datasets/:singleDataId/studies" 
                      element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady} 
                        postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_STUDIES}/>} />
                    <Route path="/datasets/:singleDataId/studies/dlg-app-dashboard" 
                      element={getDSV({...opt, tab: DatasetView.TAB_STUDIES, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />
                    
                    <Route path="/datasets/:singleDataId/history" 
                      element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady} 
                          postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_HISTORY}/>} />
                    <Route path="/datasets/:singleDataId/history/dlg-app-dashboard"
                      element={getDSV({...opt, tab: SingleDataView.TAB_HISTORY, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />

                    <Route path="/datasets/:singleDataId/access" 
                      element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady} 
                          postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_ACCESS_HISTORY}/>} />
                    <Route path="/datasets/:singleDataId/access/dlg-app-dashboard" 
                      element={getDSV({...opt, tab: SingleDataView.TAB_HISTORY, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />

                    <Route path="/datasets/:singleDataId/acl" 
                      element={<DatasetView showDialog={showDialog} keycloakReady={keycloakReady} 
                          postMessage={postMessage} dataManager={dataManager} activeTab={SingleDataView.TAB_ACL}/>} />
                    <Route path="/datasets/:singleDataId/acl/dlg-app-dashboard" 
                      element={getDSV({...opt, tab: SingleDataView.TAB_ACL, sdo: SingleDataView.SHOW_DLG_APP_DASHBOARD })} />
                    
                    <Route path="*" element={
                        <main style={{ padding: "1rem" }}>
                        <p>There is nothing here!</p>
                        </main>
                    }
                    />
                </Routes>
    </BrowserRouter>
            </div>
            <Footer />
            </Fragment>

  );
}

export default App;
