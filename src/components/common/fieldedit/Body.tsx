// import { Button} from "react-bootstrap";
import React, {FormEvent, useState} from "react";

type InputType =  "textarea" | "input-text" | "input-url";

interface BodyProps {
  oldValue: string | null | undefined;
  updValue: Function;
  inputType?: InputType
}

function getInp(value: string | null | undefined, updValue: Function, inp?: InputType): JSX.Element {
    if (inp === "textarea") {
        return <textarea rows={3} wrap="hard" className="ms-2 w-100" title="Modify field's value"
            aria-label="Edit value" value={value === undefined || value === null ? "" : value} 
            onInput={(e: FormEvent<HTMLTextAreaElement>) => {
                    e.preventDefault();
                    updValue((e.target as HTMLTextAreaElement).value);
                }} />;
    } else {
        let type = inp ? inp.substring("input-".length) : "text";
        return <input className="ms-2 w-100" title="Modify field's value" type={type}
            aria-label="Edit value" value={value === undefined || value === null ? "" : value} 
            onInput={(e: FormEvent<HTMLInputElement>) => {
                e.preventDefault();
                updValue((e.target as HTMLInputElement).value);
            }} />
    }
}

function Body(props: BodyProps) {
    const [value, setValue] = useState(props.oldValue);
    const updValue = (newVal: string | null | undefined) => {
      setValue(newVal);
      props.updValue(newVal);
    }
    //console.log(value);
    return  <div className="mb-3">
      {/* <Button title="Restore Initial value" variant="link" onClick={(e) => updValue(props.oldValue)}>Restore original</Button><br /> */}
      {getInp(value, updValue, props.inputType)}
  
    </div>;
  }

export default Body;
  