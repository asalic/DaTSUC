
import React from "react";
import { Alert } from "react-bootstrap";
import DeletedSingleData from "../../model/DeletedSingleData";
import Util from "../../Util";


interface DeleteCancelMessageT {
    deleteError?: any;
    deleteData?: DeletedSingleData | null | undefined;
  }
  
  function DelCancelSingleDataMsg({ deleteError, deleteData }: DeleteCancelMessageT ): JSX.Element {
    let msg = "";
    if (deleteError) {
      // if (xhr.status === 400) {
      //   postMessage(new Message(Message.ERROR, "Bad Request", "The dataset cannot be removed"));
      // } else if (xhr.status === 404) {
      //   postMessage(new Message(Message.ERROR, "Not found", `The dataset with ID '${data.id}' not found`));
      // } else if (xhr.status === 401) {
      //   postMessage(new Message(Message.ERROR, "Unauthorized", `You are not authorized to remove dataset with ID '${data.id}'`));
      // } else {
      //   const error: LoadingError = Util.getErrFromXhr(xhr);
      //   postMessage(new Message(Message.ERROR, error.title, error.text));
      // }
      msg = deleteError.message ?? deleteError.data ?? JSON.stringify(deleteError);
      return <Alert variant='danger' dismissible={true}>
        An error occured when trying to cancel the creation process and remove existing data: {msg}   
        </Alert>
    } else if (deleteData) {
      return <Alert variant='success' dismissible={true}>
        The creation process for the {Util.singleDataClassName(deleteData.type).toLowerCase()} '{deleteData.name}' with ID '{deleteData.id}' was cancelled and its data was successfully deleted
      </Alert>
    } else {
      return <></>;
    }
  }


export default DelCancelSingleDataMsg;