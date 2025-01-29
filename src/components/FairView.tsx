import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";


function FairView() {

  return (<Container fluid>
    We strive to respect the fair principles, please read bellow on how we do that.
    <div className="w-100 d-flex p-2 flex-column">
        <h4 title="The first step in (re)using data is to find them. Metadata and data should be easy to find for both humans and computers. Machine-readable metadata are essential for automatic discovery of datasets and services, so this is an essential component of the FAIRification process."><b className="text-decoration-underline">F</b>indable</h4>
        <div className="w-100 d-flex ps-4 flex-column">
            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/fair-data-principles-explained/f1-meta-data-assigned-globally-unique-persistent-identifiers/">
                F1. (Meta)data are assigned a globally unique and persistent identifier
                </Link><br></br>
                <span className="w-100 ps-2">
                Each dataset has a platform-wide unique ID (UUID).
                Furthermore both the studies and the included series are uniquely identified by their IDs, respectively.
                Some datasets (publicly available ones for sure) have a global ID represented by a DOI created in Zenodo.
                </span>
            </p>

            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/fair-data-principles-explained/f2-data-described-rich-metadata/">
                F2. Data are described with rich metadata (defined by <b  className="text-decoration-underline">R</b>1  below)
                </Link><br></br>
                <span className="w-100 ps-2">
                All our datasets have multiple fields describing both the content itself and the dataset.
                In the former category we have fields such as the number of studies coming from specific technologies (i.e. PET, CT, MRI etc.) or the list of the producers of the machines used to generate the images. 
                In the latter, our platform provides information regarding the license, the contact details of the author of the dataset, and the IDs of the previous and following versions of a dataset.
                </span>
            </p>
            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/f3-metadata-clearly-explicitly-include-identifier-data-describe/">
                    F3. Metadata clearly and explicitly include the identifier of the data they describe
                </Link><br></br>
                <span className="w-100 ps-2">
                    Our platform explicitly list the platform-wide ID of every dataset, both in the summary of a dataset (when listing multiple datasets, like the main page of Dataset Explorer) and the details of every individual dataset, respectively.
                    When a global DOI is available, it can be found in the details of every dataset where it is set.
                </span>
            </p>
            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/f4-metadata-registered-indexed-searchable-resource/">
                    F4. (Meta)data are registered or indexed in a searchable resource
                </Link><br></br>
                <span className="w-100 ps-2">
                    All out datasets are registered and searcheable on our platform through the Dataset Service (UI) or directly through our Datasets Service API.
                    Some datasets (like those made publicly available) have a DOI that makes them discoverable on a global scale.
                </span>
            </p>
        </div>
        <h4 title="Once the user finds the required data, she/he/they need to know how they can be accessed, possibly including authentication and authorisation."><b className="text-decoration-underline">A</b>ccessible</h4>
        <div className="w-100 d-flex ps-4 flex-column">
            <p>
                <p>
                    <Link target="_blank" to="https://www.go-fair.org/fair-principles/542-2/">
                        A1. (Meta)data are retrievable by their identifier using a standardised communications protocol
                    </Link><br></br>
                    <span className="w-100 ps-2">
                        We expose the metadata of a dataset as JSON via a REST API and display it in a web application.
                        The data itself is accessible on the platform via standard Linux mounts using the CEPH driver.                    
                    </span>
                </p>
                <div className="w-100 d-flex flex-column ps-4">
                    <p>
                        <Link target="_blank" to="https://www.go-fair.org/fair-principles/a1-1-protocol-open-free-universally-implementable/">
                            A1.1 The protocol is open, free, and universally implementable
                        </Link><br></br>
                        <span className="w-100 ps-2">
                            The REST communication protocol that we use ticks all the boxes.
                        </span>
                    </p>
                    <p>
                        <Link target="_blank" to="https://www.go-fair.org/fair-principles/a1-2-protocol-allows-authentication-authorisation-required/">
                            A1.2 The protocol allows for an authentication and authorisation procedure, where necessary
                        </Link><br></br>
                        <span className="w-100 ps-2">
                            We use the OIDC standard that integrates very well with the REST communication protocol. 
                        </span>
                    </p>
                </div>
            </p>
            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/a2-metadata-accessible-even-data-no-longer-available/">
                    A2. Metadata are accessible, even when the data are no longer available
                </Link><br></br>
                <span className="w-100 ps-2">
                    A dataset cannot be deleted from our platform, just invalidated (once it has been created).
                    An invalidated dataset is not visible to everyone, but its metadata remains unmodified on our platform.
                    A public dataset that is visible (its metadata) to everyone (including users without an account) has its metadata stored as a DOI on ZENODO.
                    It cannot be hidden by invalidate it, therefore once published, the metadata of a dataset remains visible forever (on our platform - as long as the platform is online).
                </span>
            </p>
        </div>
        <h4 title="The data usually need to be integrated with other data. In addition, the data need to interoperate with applications or workflows for analysis, storage, and processing."><b className="text-decoration-underline">I</b>nteroperable</h4>
        <div className="w-100 d-flex ps-4 flex-column">
            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/i1-metadata-use-formal-accessible-shared-broadly-applicable-language-knowledge-representation/">
                I1. (Meta)data use a formal, accessible, shared, and broadly applicable language for knowledge representation.
                </Link><br></br>
                <span className="w-100 ps-2">
                    The metadata uses JSON which is a gold standard.
                    The data format is based on DICOM, the most widely used format for medical imaging.
                </span>
            </p>
            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/i2-metadata-use-vocabularies-follow-fair-principles/">
                I2. (Meta)data use vocabularies that follow FAIR principles
                </Link><br></br>
                <span className="w-100 ps-2">
                    The datasets themselves follow the DICOM structure, as studies aggregators, therefore anyone aware of the aforementioned standard should be able to use them without too much hassle.
                    The images themselves are DICOM with the relevant tags, therefore any software that is compatible with the standard can be used.
                    The metadata of a dataset includes commonly used fields like <i>author</i> and <i>license</i>, plus aggregator fields like <i>age range</i> that list the maximum and the minimum age of the patients avaialble in a dataset.
                </span>
            </p>
            <p>
                <Link target="_blank" to="https://www.go-fair.org/fair-principles/i3-metadata-include-qualified-references-metadata/">
                I3. (Meta)data include qualified references to other (meta)data
                </Link><br></br>
                <span className="w-100 ps-2">
                Our datasets use versioning. 
                Each can have one or none successors and/or predecessors, respectively.
                Dataset Explorer links the various versions of a dataset between each other (so the user can navigate and find the desired version) and it also warns the user if the dataset that (s)he is viewing is not the latest version.

                </span>
            </p>
        </div>

        <h4 title="The ultimate goal of FAIR is to optimise the reuse of data. To achieve this, metadata and data should be well-described so that they can be replicated and/or combined in different settings."><b className="text-decoration-underline">R</b>eusable</h4>
        <div className="w-100 d-flex ps-4 flex-column">
            <p>
                <p>
                    <Link target="_blank" to="https://www.go-fair.org/fair-principles/r1-metadata-richly-described-plurality-accurate-relevant-attributes/">
                    R1. (Meta)data are richly described with a plurality of accurate and relevant attributes
                    </Link><br></br>
                    <span className="w-100 ps-2">
                        Each dataset's metadata contains numerous attributes that were selected either by surveying other software in the medical imaging domain or by direct user request.
                        On the one hand, we have attibutes that refer to the dataset itself, like <i>description</i>, <i>license</i>, or <i>author</i>.
                        On the other, we try to give some insights into the data itself with attributes like <i>age range</i>, <i>the number of studies for each sex of the patients</i>, and <i>the list of body parts and the number of studies for each</i>.
                    </span>
                </p>
                <div className="w-100 d-flex flex-column ps-4">
                    <p>
                        <Link target="_blank" to="https://www.go-fair.org/fair-principles/r1-1-metadata-released-clear-accessible-data-usage-license/">
                        R1.1. (Meta)data are released with a clear and accessible data usage license
                        </Link><br></br>
                        <span className="w-100 ps-2">
                            The datasets available on our platform can have a license that falls into one the the following categories: plaform-wide specific license, general license (e.g. CC4), or provided by the author.
                            All of them most point to a relevant URL where the actual license lies.
                        </span>
                    </p>
                    <p>
                        <Link target="_blank" to="https://www.go-fair.org/fair-principles/r1-2-metadata-associated-detailed-provenance/">
                        R1.2. (Meta)data are associated with detailed provenance
                        </Link><br></br>
                        <span className="w-100 ps-2">
                        Due to regulatory restrictions, we limit the provenance information.
                        Personal patient information is not stored on the platform and the images are pseudo-anonymized.
                        We however try to comvey as much information as possible by maintaining information like the device manufacturers of the machines used to generate the data, the sex and the age of the patients, and the year of diagnosis in the metadata.
                        The images themselves have DICOM tags that add additional details.
                        </span>
                    </p>
                    <p>
                        <Link target="_blank" to="https://www.go-fair.org/fair-principles/r1-3-metadata-meet-domain-relevant-community-standards/">
                        R1.3. (Meta)data meet domain-relevant community standards
                        </Link><br></br>
                        <span className="w-100 ps-2">
                        Our datasets are built on top of the DICOM standard, widely used in the medical imaging community.
                        They are aggregations of studies, that themselves contains series.
                        The metadata of a dataset contains aggregator fields that gives an insight into the underlying data.
                        Such fields are <i>age range</i>, <i>sex range</i> (the number of studies for each sex of the patients), and <i>body parts</i> (the list of body parts and the number of studies for each).
                        </span>
                    </p>
                </div>
            </p>
        </div>
    </div>

  </Container>);

}

export default FairView;

