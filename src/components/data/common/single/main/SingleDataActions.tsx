import React from "react";
import SingleData from "../../../../../model/SingleData";
import { useKeycloak } from "@react-keycloak/web";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import SingleDataView from "./SingleDataView";
import Dialog from "../../../../common/Dialog";

function getAction(condition: boolean, actionCb: Function, txt: string, keyName: string): JSX.Element {
    if (condition) {
      return <Dropdown.Item eventKey={keyName} key={keyName} href="#"
              onClick={() => {
                actionCb();
              }}>{txt}</Dropdown.Item>
    } else {
      return <></>;
    }
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
        size: Dialog.SIZE_LG,
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
  }
  

function SingleDataActions<T extends SingleData>({data, patchDatasetCb, showDialog}: SingleDataActionsProps<T>) {

    let { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const location = useLocation();
    let entries = [];
    if (!data["creating"] && !data["invalidated"]) {
        entries.push(
            getAction(!data["creating"] && !data["invalidated"] ,
                () => {
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
                }, "Use on Apps Dashboard", "action-use-dashboard")
              );
    }
        //console.log(`data.editablePropertiesByTheUser ${data.editablePropertiesByTheUser}`);
        if (keycloak.authenticated) {
            entries.push(
            getAction(data.editablePropertiesByTheUser.includes("invalidated"),
                () => {patchDatasetCb(keycloak.token, data["id"], "invalidated", 
                    !data.invalidated)}, data.invalidated ? "Validate" : "Invalidate", "action-invalidate"),
            getAction(data.editablePropertiesByTheUser.includes("public"),
                () => showDialogPublishDs(keycloak.token, patchDatasetCb, showDialog,  data), 
                    data.public ? "Unpublish" : "Publish", "action-publish"),
            getAction(data.editablePropertiesByTheUser.includes("draft"),
                    () => {patchDatasetCb(keycloak.token, data["id"], "draft", false)}, "Release", "action-release")
            );
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