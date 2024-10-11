import { useKeycloak } from "@react-keycloak/web";
import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useAppDispatch } from "../../../../../store";

import SingleData from "../../../../../model/SingleData";
import { api, useGetDatasetCreationStatusQuery } from "../../../../../service/singledata-api";
import UrlFactory from "../../../../../service/UrlFactory";
import SingleDataType from "../../../../../model/SingleDataType";
import Config from "../../../../../config.json";

// const MSG_INVALIDATED = 1;
// const MSG_NEXT_ID = 2;
//const MSG_CREATION_STAT = 3;

interface MessageBox<T extends SingleData> {
    keycloakReady: boolean;
    dataset: T;
}

function MessageBox<T extends SingleData>({keycloakReady, dataset}: MessageBox<T>) {
    //const [msgs, setMsgs] = useState<object>({});
    const dispatch = useAppDispatch();
    const [pollingInterval, setPollingInterval] = useState(Config.refreshDatasetCreate); 
    const { keycloak } = useKeycloak();

    const { data, isLoading, error, isError } = useGetDatasetCreationStatusQuery({
        token: keycloak.token, id: dataset.id
    }, {
        skip: !(dataset && dataset.draft  && keycloakReady && dataset.creating),
        pollingInterval
    });
    const msgs = [];
    if (dataset.invalidated) {
        msgs.push("This dataset has been invalidated.");
    }
    if (dataset.nextId) {
        const path = UrlFactory.singleDataDetails(dataset.nextId, SingleDataType.DATASET); 
        msgs.push(`There is a newer version for this dataset, 
            <a href="${path}">${dataset.nextId}</a>`);

    }
    if (!isLoading && !error && data ) {
        if (data.status === "finished") {
            msgs.push(`Dataset creation finished with last message: ${data.lastMessage}`);
        } else {
            msgs.push(`Dataset creation in progress with last message: ${data.lastMessage}`);
        }
    }

    const cancelPolling: boolean = ( error !== undefined && error !== null ) || isError || data?.status === "finished";

    useEffect(() => {
        if (cancelPolling){
            setPollingInterval(0);
            // dispatch(
            //     api.endpoints.getSingleDataPage.initiate(
            //         {
            //             token: keycloak.token,
            //             singleDataType: SingleDataType.DATASET
            //         },
            //         { subscribe: false, forceRefetch: true }
            //     )
            // )
            dispatch( api.util.invalidateTags(["Dataset", {type: "Dataset", id: dataset.id}]) );
        } else {
            setPollingInterval(Config.refreshDatasetCreate);
        }
     }, [setPollingInterval, cancelPolling]);
    // const getCreationStatus = useCallback(() => {
    //     dataManager.getDatasetCreationStatus(keycloak.token, dataset.id)
    //         .then(xhr => {
    //             const stat = JSON.parse(xhr.response);
    //             let msg = `Dataset creation in progress with last message: ${stat.lastMessage}`;
    //             if ((stat.status === "finished" || stat.status === "error") && !dataset.creating) {
    //                 getDataset(keycloak.token, dataset.id);
    //                 msg = `Dataset creation finished with last message: ${stat.lastMessage}`;
    //             }
    //             setMsgs(prevM => { return {...prevM, [MSG_CREATION_STAT]: msg};});
    //         })
    //         .catch(xhr => {
    //             const error = Util.getErrFromXhr(xhr);
    //             postMessage(new Message(Message.ERROR, "Unable to refresh dataset creation status", error.text));

    //         });
    //   }, [msgs, dataset]);
    //   useEffect(() => {
    //     if (dataset && dataset.draft  && keycloakReady && dataset.creating) {
    //             getCreationStatus();
    //             console.log(`initial get creation status ${dataset}`);
    //         }

    //   }, [dataset]);
    // useEffect(() => {
    //     let intervalStat: number | null = null;
    //     if (dataset && dataset.draft  && keycloakReady) {
    //         if (dataset.creating) {
    //             intervalStat = window.setInterval(() => {
    //                 console.log(`get creation status ${dataset}`);
    //                 getCreationStatus()
    //             }, Config.refreshDatasetCreate);
    //         } else {
    //             if (intervalStat) {
    //                 clearInterval(intervalStat);
    //             }
    //         }
    //     }
    //     return () => { if (intervalStat) clearInterval(intervalStat); };

    // }, [dataset]);
    return <>
        {
            isError ? <Alert variant="danger">{`Error loading dataset creation status: ${error.message ?? error.data}`}</Alert> : <></>
        }
        {
            Object.values(msgs).length > 0 ?
            
                    <Alert variant="warning">
                            <ul>
                                {
                                    Object.values(msgs).map((m: string) => <li key={m} dangerouslySetInnerHTML={{ __html: m }}></li>)
                                }
                            </ul>
                        </Alert>
            : <></>
        }
    </>
}

export default MessageBox;