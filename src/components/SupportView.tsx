import React from "react";
import {  Container } from 'react-bootstrap';
import config from "../service/config";

function SupportView() {
    return (
        <Container>
            <div className="alert alert-info" role="alert">
                Please use the link bellow to report bugs or request new functionality for any service, component, application etc. on the platform (by creating an issue).  
                You will be redirected to Github to the list of already existing issue. 
                Before anything, please check this list, the problem you have encountered on our platform might have been reported already.  
                If you find an existing issue that matches your own, feel free to join the discussion, we are happy to assist you. 
                Otherwise, please use the <b>New issue</b> green button to open a new one. 
                Do not forget to include as much information as possible, <i className="text-decoration-underline">but take into account that <b>ALL</b> the information you post is publicly available, anyone on the Internet can see it.</i>
                <br></br>
            </div>
            <p>
                <a href={config.externalLinks.supportReportRequest}><b>Report bug/Request new functionality</b></a>
            </p>
        </Container>
    );
}
export default SupportView;