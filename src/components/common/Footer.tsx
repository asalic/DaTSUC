import React from "react";
import config from "../../service/config";

function Footer() {

    return (
        <div className="d-flex justify-content-between w-100 p-1 text-black bg-light bg-gradient mt-4 " style={{"fontSize":"0.75em"}}>
            <span className="ms-2 me-2"><img src={process.env["PUBLIC_URL"] + "/icons/eu.svg"} 
                style={{height:"0.75em"}}/><b className="ms-2">{config.project.name} Project</b>
                {
                    config?.project.doi ?
                        <>, DOI <a href={`https://doi.org/${config.project.doi}`}>{config.project.doi}</a></>
                        : <></>
                }
            </span>
            <span className="ms-2 me-2">Copyright© <a href="https://www.upv.es/en">UPV</a> 2020-2025 
            
                {
                    config?.project.termsConditions ?
                        <> | <a href={config.project.termsConditions} target="_blank" >Terms & Conditions</a></>
                        : <></>
                }
                {
                    config?.project.privacyPolicy ?
                        <> | <a href={config.project.privacyPolicy} target="_blank">Privacy Policy</a></>
                        : <></>
                }
                {
                    config?.project.sla ?
                        <> | <a href={config.project.sla} target="_blank">SLA</a></>
                        : <></>
                }
            </span>
             
            <span className="ms-2 me-2">Powered by <a href="https://reactjs.org/">React</a> & <a href="https://react-bootstrap.github.io/">React Bootstrap</a></span>
        </div>
    );
}

export default Footer;