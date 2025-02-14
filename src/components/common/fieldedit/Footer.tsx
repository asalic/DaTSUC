import { Button} from "react-bootstrap";
import React from "react";

import Dialog from "../Dialog";

interface FooterProps {
  updValue: Function,
  oldValue: any;
  patch: Function;
}

function Footer(props: FooterProps) {

    return <div className="w-100 p-1">
      <Button title="Discard changes and close dialog" className="float-end m-1" 
        onClick={() => {props.updValue(props.oldValue);Dialog.HANDLE_CLOSE();}}>Cancel</Button>
      <Button title="Update field and close dialog" className="float-end m-1" onClick={() => {
         props.patch();
      }}>Update</Button>
    </div>
  }

export default Footer;
  