import { Container } from "react-bootstrap";
import React from "react";
import { useKeycloak } from "@react-keycloak/web";

import SingleDataType from "../../../../../model/SingleDataType";
import { useGetSingleDataQuery } from "../../../../../service/singledata-api";
import LoadingView from "../../../../common/LoadingView";
import ErrorView from "../../../../common/ErrorView";
import ProgrammaticError from "../../../../common/ProgrammaticError";
import DetailsBox, { getEntryWithStudyCnt } from "../../../common/single/details/DetailsBox";
import Dataset from "../../../../../model/Dataset";



interface DatasetDetailsBoxProps {
  showDialog: Function;
  keycloakReady: boolean;
  singleDataId: string;
}

function DatasetDetailsBox(props: DatasetDetailsBoxProps) {
    const { keycloak } = useKeycloak();


  const { data, isLoading, error, isError } = useGetSingleDataQuery({
      token: keycloak.token,
      id: props.singleDataId,
      singleDataType: SingleDataType.DATASET
    }
    // ,
    // {
    //   skip: !(props.keycloakReady)
    // }
  )

  const dt: Dataset = data as Dataset;

  if (isLoading) {
    return <LoadingView what="data" />
  } else if (isError) {
    return <ErrorView message={`Error loading data: ${error.message ?? JSON.stringify(error.data) ?? ""}`} />;
  } else if (dt) {


    const diagnosis = getEntryWithStudyCnt(dt.diagnosis, dt.diagnosisCount);

    return(
      <Container fluid className="pt-3 pb-1 bg-light bg-gradient border border-secondary rounded">
        <DetailsBox data={dt} keycloakReady={props.keycloakReady} showDialog={props.showDialog} singleDataId={props.singleDataId} singleDataType={SingleDataType.DATASET}/>
        <p title="The set of diagnosis available in this dataset, DICOM tag (70D1,2000), private tag (project name)"><b>Diagnosis{diagnosis.show ? " (#studies)" : ""}</b><br />
            <span className="ms-3">{diagnosis.txt}</span>
        </p>
      </Container>
    );
  } else {
    return <ProgrammaticError msg="Data is null or undefined, please contact the devaloper" />
  }
}

export default DatasetDetailsBox;