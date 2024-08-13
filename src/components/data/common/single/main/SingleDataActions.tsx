import React from "react";
import SingleData from "../../../../../model/SingleData";
import { useKeycloak } from "@react-keycloak/web";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import SingleDataView from "./SingleDataView";
import Dialog from "../../../../common/Dialog";
import DialogSize from "../../../../../model/DialogSize";
import { useCallback } from "react";
import DataManager from "../../../../../api/DataManager";
import Message from "../../../../../model/Message";
import LoadingError from "../../../../../model/LoadingError";
import Util from "../../../../../Util";
import CheckIntegrity from "../../../../../model/CheckIntegrity";

function getAction(actionCb: Function, txt: string, keyName: string): JSX.Element {
      return <Dropdown.Item eventKey={keyName} key={keyName} href="#"
              onClick={() => {
                actionCb();
              }}>{txt}</Dropdown.Item>;
  }

function showDialogPublishDs<T extends SingleData>(token: string | null | undefined, patchDatasetCb: Function, showDialog: Function,  data: T): void {
    if (!data["public"]) {
      const  showZenodo = data["pids"]["preferred"] == null;
      showDialog({
        show: true,
        footer: <div>
            <Button className="m-2" onClick={() => {patchDatasetCb(token, data["id"], "public", !data.public);Dialog.HANDLE_CLOSE();}}>Publish</Button>
            <Button className="m-2" onClick={() => Dialog.HANDLE_CLOSE()}>Cancel</Button>
          </div>,
        body: <div>
            The published dataset:
            <ul>
              <li>will be visible and usable by registered users out of CHAIMELEON consortium</li>
              <li>will be visible (the metadata, never the contents) by unregistered users</li>
              {showZenodo ? <li>the metadata and a small index of studies will be deposited publicly in Zenodo.org in order to obtain a DOI*</li> : <></>}
            </ul>
            {showZenodo ?
                <div className="mt-4">
                  *Metadata includes the content of &quot;Details&quot; tab: author, creation date, contact information, license and statistical info.
                  Index of studies includes some content of &quot;Studies&quot; tab: study id, study name, subject name and series name.
                </div>
                : <></>}
          </div>,
        title: <div>Publish dataset <b>{data["name"]}</b> (<i>{data["id"]}</i>)</div>,
        size: DialogSize.SIZE_LG,
        onBeforeClose: null
      });
    } else {
      patchDatasetCb(token, data["id"], "public", !data.public);
    }
  }



  interface SingleDataActionsProps<T extends SingleData> {
      data: T;
      patchDatasetCb: Function;
      showDialog: Function;
      keycloakReady: boolean;
      dataManager: DataManager;
      postMessage: Function;
  }
  

function SingleDataActions<T extends SingleData>({data, patchDatasetCb, showDialog, keycloakReady, dataManager, postMessage}: SingleDataActionsProps<T>) {

    let { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const location = useLocation();

    const checkIntegrity = useCallback(() => {
      if (keycloakReady && keycloak.authenticated && keycloak.token) {
  
          dataManager.postCheckIntegrity(keycloak.token, data.id)
            .then(
              (xhr: XMLHttpRequest) => {
                const res: CheckIntegrity = Object.assign(new CheckIntegrity(), JSON.parse(xhr.response));
                if (res.success) {
                  postMessage(new Message(Message.SUCCESS, "Integrity check process", res.msg));
                } else {
                  postMessage(new Message(Message.WARN, "Integrity check process", res.msg));
                }
              },
              (xhr: XMLHttpRequest) => {
                const error: LoadingError = Util.getErrFromXhr(xhr);
                postMessage(new Message(Message.ERROR, error.title, error.text));
              });
      }
  
    }, [data.id, keycloakReady, keycloak.authenticated, keycloak.token, dataManager, postMessage]);

    let entries = [];
    if (keycloak.authenticated) {
      if (data.allowedActionsForTheUser.includes("checkIntegrity")) {
        entries.push( 
          getAction(() => checkIntegrity(), 
                  "Check Integrity", "action-checkintegrity"));
      }
      if (!data["creating"] && !data["invalidated"] 
        && data.allowedActionsForTheUser.includes("use")) {
          entries.push(getAction(() => {
            const path = location.pathname;
            // if (keycloak.authenticated) {
            //   navigate(`${path}/${SingleDataView.SHOW_DLG_APP_DASHBOARD}`);
            //   showDialogAppDashhboard(data["id"], showDialog, () => {
            //     navigate(popPath(path));
            //   })
            // } else {
                if (path.endsWith(SingleDataView.SHOW_DLG_APP_DASHBOARD))
                keycloak.login();
                else {
                navigate(`${path}/${SingleDataView.SHOW_DLG_APP_DASHBOARD}`);
                keycloak.login();
                }
            //}
            }, "Use on Apps Dashboard", "action-use-dashboard"));
        }
        if  (data.editablePropertiesByTheUser.includes("invalidated")) {
          entries.push(
            getAction(() => {patchDatasetCb(keycloak.token, data["id"], "invalidated", 
              !data.invalidated)}, data.invalidated ? "Validate" : "Invalidate", "action-invalidate")
          );
        }
        if (data.editablePropertiesByTheUser.includes("public")) {
          entries.push( 
            getAction(() => showDialogPublishDs(keycloak.token, patchDatasetCb, showDialog,  data), 
                    data.public ? "Unpublish" : "Publish", "action-publish"));
        }
        if (data.editablePropertiesByTheUser.includes("draft")) {
          entries.push( 
            getAction(() => {patchDatasetCb(keycloak.token, data["id"], "draft", false)}, "Release", "action-release")
            );
        }
      }
    //}
    if (entries.length !== 0) {
        return  <DropdownButton key="actions-drop" title="Actions">
            {entries}
                </DropdownButton>;
    }
    return <></>;
}

export default SingleDataActions;