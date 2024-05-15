import {Tab, Row, Col, Container, Nav } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import React, { Fragment } from "react";
import DataManager from "../../../../../api/DataManager";
import SingleData from "../../../../../model/SingleData";
import SingleItemTab from "../../../../../model/SingleItemTab";
import LoadingData from "../../../../../model/LoadingData";
import UnauthorizedView from "../../../../UnauthorizedView";
import ResourceNotFoundView from "../../../../common/ResourceNotFoundView";
import Breadcrumbs from "../../../../common/Breadcrumbs";
import SingleDataTitle from "./SingleDataTitle";
import SingleDataActions from "./SingleDataActions";


SingleDataView.TAB_DETAILS = "details";
SingleDataView.TAB_HISTORY = "history";
SingleDataView.TAB_ACCESS_HISTORY = "access";
SingleDataView.TAB_ACL = "acl";
//SingleDataView.TAB_DASHBOARD = "dashboard";

SingleDataView.SHOW_DLG_APP_DASHBOARD = "dlg-app-dashboard"

// const routeRoot = "/datasets/:datasetId";

// const routesTabs = {
//   [`${routeRoot}/${SingleDataView.TAB_DETAILS}`]: SingleDataView.TAB_DETAILS,
//   [`${routeRoot}/${SingleDataView.TAB_STUDIES}`]: SingleDataView.TAB_STUDIES,
//   [`${routeRoot}/${SingleDataView.TAB_HISTORY}`]: SingleDataView.TAB_HISTORY,
//   [`${routeRoot}/${SingleDataView.TAB_ACCESS_HISTORY}`]: SingleDataView.TAB_ACCESS_HISTORY,
  
// }

// function triggerFocus(element) {
//     var eventType = "onfocusin" in element ? "focusin" : "focus",
//         bubbles = "onfocusin" in element,
//         event;

//     if ("createEvent" in document) {
//         event = document.createEvent("Event");
//         event.initEvent(eventType, bubbles, true);
//     }
//     else if ("Event" in window) {
//         event = new Event(eventType, { bubbles: bubbles, cancelable: true });
//     }

//     element.focus();
//     element.dispatchEvent(event);
// }



interface SingleDataViewProps<T extends SingleData> {
  dataManager: DataManager;
  postMessage: Function;
  showDialog: Function;
  keycloakReady: boolean;
  showdDlgOpt?: string | null | undefined;
  activeTab: string;
  tabs: SingleItemTab[];
  patchSingleData: Function;
  singleData: LoadingData<T>
}

function SingleDataView<T extends SingleData>(props: SingleDataViewProps<T>) {

  // const path: string | null | undefined = matchPath( location.pathname, routesTabs )?.path;

    let params = useParams();
  let navigate = useNavigate();
  //const [activeTab, setActivetab] = useState<string>(props.activeTab);
  const datasetId: string | undefined = params["singleDataId"];//props.datasetId;
    // const handlePostMsg = useCallback((msgType, title, text) => {
    //   props.postMessage(new Message(msgType, title, text));
    // }, []);
  if (datasetId) {
    if (props.singleData.error !== null) {
      if (props.singleData.statusCode === 401) {
        return <UnauthorizedView />
      } else if (props.singleData.statusCode === 404) {
        return <ResourceNotFoundView id={datasetId} />;
      } else {
        return <div>Error</div>;
      }
    } else if (props.singleData.data === null || props.singleData.loading) {
        return <div>loading...</div>;
    }
  } else {
    if (props.singleData.data === null || props.singleData.loading) {
      return <div>loading...</div>
    } else {    
      return <div>No dataset ID specified</div>; 
    }
  }

  return (
    <Fragment>
      <Breadcrumbs elems={[{text: 'Dataset information', link: "", active: true}]}/>
      <Row className="mb-4 mt-4">
        <Col md={11}>
          <SingleDataTitle data={props.singleData.data} patchDataset={props.patchSingleData} showDialog={props.showDialog} 
            keycloakReady={props.keycloakReady} dataManager={props.dataManager} datasetId={datasetId} />
        </Col>
        <Col md={1}>
          <div className="float-end">
            <SingleDataActions data={props.singleData.data} patchDatasetCb={props.patchSingleData} showDialog={props.showDialog}/>
          </div>
        </Col>
      </Row>
      <Container fluid className="w-100 h-75">

        <Tab.Container defaultActiveKey="details" activeKey={props.activeTab} 
              onSelect={(k) => {console.log(k);navigate(`/datasets/${datasetId}/${k}`)}}>
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column mb-5">
                {
                  props.tabs.map(s => 
                    <Nav.Item>
                      <Nav.Link eventKey={s.eventKey}>{s.title}</Nav.Link>
                    </Nav.Item>
                  )
                }
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                {
                  props.tabs.filter(s => s.eventKey === props.activeTab).map(s => 
                    <Tab.Pane eventKey={s.eventKey}>
                        {s.view}
                    </Tab.Pane>
                  )
                }
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Fragment>
      );
}

export default SingleDataView;
