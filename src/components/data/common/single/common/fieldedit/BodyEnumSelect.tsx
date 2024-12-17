import React, { useState } from "react";
import { Form } from "react-bootstrap";

interface BodyEnumSelectProps {
    allValues: string[];
    updValue: Function;
    oldValue: string[];
}

function BodyEnumSelect({allValues, updValue, oldValue}: BodyEnumSelectProps): JSX.Element {
    const olds = new Set(oldValue);
    const [checked, setChecked] = useState(Object.fromEntries(allValues.sort().map(v => [v, olds.has(v)])));
    return <div className="m-2">
        <h4>Available properties:</h4>
        <Form className="ms-4">
        {
            allValues.map(v => <Form.Check // prettier-ignore
                type="switch"
                id={`custom-${v}`}
                label={v}
                checked={checked[v]}
                onChange={(e) => {
                    const checkedV = e.target.checked;
                    setChecked(prev => {
                        return {
                            ...prev,
                            [v]: checkedV
                        }
                    });
                    // if (checked) {
                    console.log(checkedV);
                    console.log(checked);
                    const ch = JSON.parse(JSON.stringify(checked));
                    ch[v] = checkedV;
                    updValue(Object.entries(ch).filter(([k, v]) => v === true).map(([k, v]) => k).sort());
                    // } else {
                    //     olds.delete(v);
                    //     updValue(Array.from(olds));//oldValue.filter(vals => vals !== v));
                    // }
                }}
              />)
        }
        </Form>
    </div>;
}

export default BodyEnumSelect;