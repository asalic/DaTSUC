import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { CheckCircleFill, ClipboardPlus, XCircleFill } from "react-bootstrap-icons";

interface CopiableFieldEntryProps {
    text: string;
    fontSizeText?: string;
    boldText?: boolean;
    italicText?: boolean;
    title?: string;
}

function CopiableFieldEntry({ text, fontSizeText, boldText, italicText, title}: CopiableFieldEntryProps): JSX.Element {
    const fontSize = fontSizeText ?? "100%";
    const fontWeight: string = boldText !== undefined ? "bold" : "normal";
    const fontStyle:  string = italicText !== undefined ? "italic" :  "normal";
    const [copySuc, setCopySuc] = useState<boolean | null>(null);
    const txtIdClass = (copySuc !== null ? (copySuc ? " copy-success " : " copy-error ") : "");
    return (<><span style={{fontSize,  fontWeight,  fontStyle }} className={txtIdClass} onAnimationEnd={() => setCopySuc(null)}>{text}</span>
    <Button  title={title ?? "Copy value"} style={{fontSize, fontWeight, fontStyle }} variant="link" className="m-0 p-0 ms-1" onClick={(e) =>
            {
              if (navigator.clipboard) { 
                navigator.clipboard.writeText(text).then(function() {
                    console.log('Async: Copying to clipboard was successful!');
                    setCopySuc(true);
                  }, function(err) {
                    console.error('Async: Could not copy text: ', err);
                    setCopySuc(false);
                  })
              } else {
                  console.error('Async: Could not copy text'); 
                  setCopySuc(false);
              }
            }
        } >

        {copySuc !== null ? (copySuc ? 
                                    <CheckCircleFill color="green"/> 
                                    : <XCircleFill color="red"/>) 
                          : <ClipboardPlus />}
        
      </Button></>);
}

export default CopiableFieldEntry;