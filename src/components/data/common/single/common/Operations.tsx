import React from "react";
import Util from "../../../../../Util";
import config from "../../../../../service/config";
import DialogSettings from "../../../../../model/DialogSettings";
import DialogSize from "../../../../../model/DialogSize";

const KUBE_APPS_CLUSTER = "default";


function showDialogAppDashhboard(datasetId: string, showDialog: Function, onBeforeClose: Function, uNameKeycloak: string | null | undefined): void {
  let kubeAppsUrl = config.appsDashboard;
  if (uNameKeycloak) {
    const uNamespace = Util.getUserKubeNamespace(Util.parseK8sNames(uNameKeycloak, true));
    if (uNamespace) {
      kubeAppsUrl = `${config.appsDashboard}/#/c/${KUBE_APPS_CLUSTER}/ns/${uNamespace}/catalog`;
    }
  }

  const diagProps: DialogSettings = {
    show: true,
    footer: <></>,
    body: <iframe title="Kube Apps" onLoad={(e) => onLoadAppsDashboard(e.target as HTMLIFrameElement, datasetId)} 
              src={kubeAppsUrl} style={{ width: "100%", height: "100%" }}/>,
    title: <span>Apps Dashboard for dataset <b>{datasetId}</b></span>,
    size: DialogSize.SIZE_XXL,
    onBeforeClose: () => onBeforeClose(),
    scrollable: true
  };
  
  showDialog(diagProps);
}

function onLoadAppsDashboard(iframeDom: HTMLIFrameElement, datasetId: string): void {
  // Create an observer instance linked to the callback function
  const config = { attributes: true, childList: true, subtree: true };
  const targetNode: Node | undefined = iframeDom.contentWindow?.document.body;
  const cb = (mutationsList: MutationRecord[], observer: MutationObserver) => {
    observer.disconnect();
    const inp: HTMLInputElement | undefined | null = iframeDom.contentWindow?.document.body.querySelector("#datasets_list-0");
    if (inp) {
        // React swallows the event, and overides the setter, we have to use the native
        let nativeInputValueSetter: Function | undefined = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(inp, datasetId);
          let event = new Event('change', {
              bubbles: true
          });
          inp.dispatchEvent(event);
        } else {
          console.error("Setter is undefined");
        }
    }
    // Set all links in the Installation Notes section to be openable in a new tab
    const appnotes: Element | null | undefined = iframeDom.contentWindow?.document.body.querySelector(".application-notes");
    if (appnotes) {
      const links = appnotes.querySelectorAll("a");
      for (let a of links) {
        a.target = "_blank";
      }
    } else {
      console.error("appnotes is null or undefined");
    }
    if (targetNode) {
      observer.observe(targetNode, config);
    } else {
      console.error("Iframe body is undefined")
    }
  }
  const observer = new MutationObserver(cb);

  // Start observing the target node for configured mutations  
  if (targetNode) {
    observer.observe(targetNode, config);
  } else {
    console.error("Iframe body is undefined")
  }
}



export { showDialogAppDashhboard, onLoadAppsDashboard }