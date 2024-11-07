import { Alert, Modal} from 'react-bootstrap';
import React, { useState, useEffect} from "react";
import type DialogSettings from '../../model/DialogSettings';
import DialogSize from '../../model/DialogSize';
import Message from '../../model/Message';

let outsideSetShow: Function | null;
let outsideSetMessage: Function | null;

const handleClose = (onBeforeClose?: Function | null) => {
  if (onBeforeClose) {
    if (typeof onBeforeClose === 'function') {
        onBeforeClose();
    } else
      throw new Error("Dialog: On before clause parameter must be a function");
  }
  if (outsideSetShow) {
    outsideSetShow(false);
    if (outsideSetMessage) {
      outsideSetMessage(null);
    }
  } else {
    console.error("outsidesetShow is not defined or null");
  }
};

const bodyMessage = (message: Message) => {
  if (outsideSetMessage) {
    outsideSetMessage(message);
  }
}


interface DialogProps {
  settings: DialogSettings;
}

function Dialog({settings}: DialogProps) {
  const [show, setShow] = useState(false);
  const [bodyMsg, setBodyMsg] = useState<Message | null>(null);
  useEffect(() => {
    /* Assign update to outside variable */
    outsideSetShow = setShow;

    /* Unassign when component unmounts */
    return () => { outsideSetShow = null; };
  }, []);

  useEffect(() => {
    /* Assign update to outside variable */
    outsideSetMessage = setBodyMsg;

    /* Unassign when component unmounts */
    return () => { outsideSetMessage = null; };
  }, []);

  useEffect(() => {
      setShow(settings.show);
  }, [settings]);
  let dialogClassName = undefined;
  let size: "xl" | "lg" | "sm" | undefined = undefined;
  if (settings.size === DialogSize.SIZE_XXL) {
    dialogClassName = "modal-xxl";
    //size = "";
  } else if (settings.size === DialogSize.SIZE_XL) {
    dialogClassName = "";
    size = "xl";
  } else if (settings.size === DialogSize.SIZE_LG) {
      dialogClassName = "";
      size = "lg";
  } else if (settings.size === DialogSize.SIZE_SM) {
      dialogClassName = "";
      size = "sm";
  } else {
    console.error(`unhandled dialog size ${settings.size}`);
  }
  return (
    <>
      <Modal 
          {...(dialogClassName !== undefined && { dialogClassName })} 
          {...(size !== undefined && { size: size })} 
          show={show} scrollable={settings.scrollable} onHide={() => handleClose(settings.onBeforeClose)}>
        <Modal.Header closeButton>
          <Modal.Title>{settings.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bodyMsg ?
            <Alert variant={bodyMsg.type}>{bodyMsg.title ? <b>{bodyMsg.title + ": "}</b> : <></>}
              {bodyMsg.message ? bodyMsg.message : ""}</Alert>
            : <></>
          }
          {settings.body}
        </Modal.Body>
        <Modal.Footer>
          {settings.footer}
        </Modal.Footer>
      </Modal>
    </>
  );
}

Dialog.HANDLE_CLOSE = handleClose;
Dialog.BODY_MESSAGE = bodyMessage;
export default Dialog;
