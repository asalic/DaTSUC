import { Button } from "react-bootstrap";
import { PencilFill } from 'react-bootstrap-icons';
import React, { useState, useEffect } from "react";
import { useKeycloak } from '@react-keycloak/web';
import SingleDataFactory from "../../../api/SingleDataFactory";
import Dialog from "../Dialog";
import Message from "../../../model/Message";
import Util from "../../../Util";
import Footer from "./Footer";
import DialogSize from "../../../model/DialogSize";
import bodyFactory from "./bodyFactory";
import BodyFactorySpecType from "../../../model/BodyFactorySpecType";

interface GenericFieldEditProps<M> {
  oldValue: any;
  field: string;
  keycloakReady: boolean;
  fieldDisplay: string;
  showDialog: Function;
  patchMutation: any;
  patchExternalFields?: object;
  spec: BodyFactorySpecType;
  additionalBodyProps?: M;
  children?: React.ReactNode;
}


function GenericFieldEdit<M>(props: GenericFieldEditProps<M>): JSX.Element {
  const [patchSingleData, {isError: isPatchError, isLoading: isPatchLoading, error: patchError } ] 
    = props.patchMutation();
  let [value, setValue] = useState<any>(props.oldValue);
  useEffect(() => setValue(props.oldValue), [props.oldValue]);
   let { keycloak } = useKeycloak();


  //console.log(`props.oldValue is ${JSON.stringify(props.oldValue)}`);
  //console.log(`dfe value is ${JSON.stringify(value)}`);
  const [isPatchValue, setIsPatchValue] = useState(false);
  const updValue = (newVal: any) => {setValue(newVal);};
  const patchDataset = () => {
    setIsPatchValue(true);
   
  }
  useEffect(() => {
    if (isPatchValue) {
        patchSingleData({
          token: keycloak.token,
          //id: props.singleDataId, 
          property: SingleDataFactory.apiFieldName(props.field), 
          value, 
          ...(props.patchExternalFields) && {...props.patchExternalFields}
          //singleDataType: props.singleDataType
        });
      //props.patchDataset(keycloak.token, props.datasetId, props.field, sVal);
     
    }
  }, [isPatchValue, setIsPatchValue, patchSingleData, value, keycloak, props]);

  useEffect(() => {
    if (isPatchValue) {
      // if (!isPatchLoading && !isPatchError) {        
      //   Dialog.HANDLE_CLOSE();
      // }
      if (!isPatchLoading) {
        setIsPatchValue(false);
        if (isPatchError) {
          Dialog.BODY_MESSAGE(new Message(Message.ERROR, "Update error", Util.getError(patchError).message));
        } else {
          Dialog.HANDLE_CLOSE();
        }
        
      } else {
        Dialog.BODY_MESSAGE(new Message(Message.INFO, "Updating, please wait..."));
      }
      
    }
  }, [isPatchError, isPatchLoading, patchError, Dialog.HANDLE_CLOSE]);
  // console.log(patchStatus);
  // const patchDatasetCb = (newData) => setData( prevValues => {
  //    return { ...prevValues, data: newData.data, isLoading: newData.isLoading, isLoaded: newData.isLoaded, error: newData.error, status: newData.status}}
  //  );
  
  
  return <Button title={`Edit field '${props.fieldDisplay}'`} variant="link" className="m-0 ms-1 me-1 p-0" onClick={() =>
      {
        props.showDialog({
          show: true,
          footer: <Footer updValue={updValue} patch={patchDataset} oldValue={props.oldValue} />,
          body: bodyFactory<M>(props.spec, props.field, updValue, 
            props.oldValue, props.keycloakReady, props.additionalBodyProps),
          title: <span>Edit <b>{props.fieldDisplay}</b></span>,
          size: DialogSize.SIZE_LG,
          onBeforeClose: null
        });
        //patchDataset(props.field, props.newValue, props.succUpdCb);
      }} >
    <PencilFill />
    {
        props.children
    }
  </Button>
}

export default GenericFieldEdit;
