import RouteFactory from "../../../../../api/RouteFactory";
import SingleDataType from "../../../../../model/SingleDataType";
import React, { Fragment } from "react";
// import DatasetFieldEdit from "../common/DatasetFieldEdit";
import SingleData from "../../../../../model/SingleData";
import SingleDataTypeApiType from "../../../../../model/SingleDataTypeApiType";
import { Badge } from "react-bootstrap";
import CollectionMethodType from "../../../../../model/CollectionMethodType";
import GenericFieldEdit from "../../../../common/fieldedit/GenericFieldEdit";
import { usePatchSingleDataMutation } from "../../../../../service/singledata-api";
import BodyFactorySpecType from "../../../../../model/BodyFactorySpecType";


const PREVIOUS_ID = "Previous version";
const NEXT_ID = "Next version";

interface EntryWithStudyResult {
  txt: string;
  show: boolean;
}

function getIdEdit(singleDataId: string, singleDataType: SingleDataType, 
    text: string, ds: SingleData | undefined, showDialog?: Function, keycloakReady?: boolean) {
  if (text === PREVIOUS_ID && ds && ds.editablePropertiesByTheUser.includes("previousId") 
      && showDialog && keycloakReady) {
    return <GenericFieldEdit 
        oldValue={ds.previousId} field="previousId" 
        keycloakReady={keycloakReady} 
        fieldDisplay="previous version"
        showDialog={showDialog}
        patchMutation={usePatchSingleDataMutation}
        patchExternalFields={{
            id: singleDataId,
            singleDataType
        }}
        spec={BodyFactorySpecType.SINGLEDATA}
        additionalBodyProps={
            {
                singleDataType
            }
        }/>;
  } else if (text === NEXT_ID){
    return <Fragment />;
  } else {
    console.warn(`Unhandled ID edit option ${text}`);
  }
  return <Fragment />;
}

function getIDLink(singleDataId: string, singleDataType: SingleDataType, 
      text: string, id: string | null, canEdit: boolean, data?: SingleData, 
      showDialog?: Function, keycloakReady?: boolean) {
  if (id || canEdit) {
    return <p title={`ID of the ${text} version of this dataset`}><b>{text}</b>
          { getIdEdit(singleDataId, singleDataType, text, data, showDialog, keycloakReady) }<br />
          <span className="ms-3">{ id ? <a href={RouteFactory.getPath(RouteFactory.DATASET_DETAILS, { datasetId: id } )}>{id}</a> : "-" }</span>
        </p>;
  } else {
    return <Fragment />
  }
}

function getEntryWithStudyCnt(entryLst: string[] | null, countLst: number[] | null): EntryWithStudyResult {
  let txt: string = "-";
  let show = false;
  if (entryLst && entryLst.length > 0) {
    if (countLst && countLst.length > 0 && entryLst.length  === countLst.length) {
      txt = entryLst.map((s, idx) => `${s} (${countLst[idx]})`).join(", ");
      show = true;
    } else {
      txt = entryLst.join(", ");
    }
  }
  return {txt, show};
}

function getYearLowHigh(ageLow: number | null, ageHigh: number | null, ageUnit: string[], 
    ageNullCount: number | null, unknownTxt: string): string {
  let ageLstItemTxt: string = "-";
  if (ageLow !== null && ageHigh !== null) {
    ageLstItemTxt = `Between ${ageLow} ${ageUnit.length >= 1 ? ageUnit[0] : ""} and ${ageHigh} ${ageUnit.length >= 2 ? ageUnit[1] : ""}`;
  } else if (ageLow !== null)  {
    ageLstItemTxt = `Greater than ${ageLow} ${ageUnit.length >= 1 ? ageUnit[0] : ""}`;
  } else if (ageHigh !== null)  {
    ageLstItemTxt = `Less than ${ageHigh} ${ageUnit.length >= 2 ? ageUnit[1] : ""}`;
  }

  if (ageLow !== null || ageHigh !== null) {
    if (ageNullCount && ageNullCount === 1) {
      ageLstItemTxt += ` (1 study with ${unknownTxt} unknown)`;
    } else if (ageNullCount && ageNullCount >= 1) {
      ageLstItemTxt += ` (${ageNullCount} studies with ${unknownTxt} unknown)`;
    }
  }
  return ageLstItemTxt;
}

interface DetailsBoxProps<T extends SingleData>{
    data: T;
    singleDataType: SingleDataType;
    singleDataId: string;
    keycloakReady: boolean;
    showDialog: Function;
}

function DetailsBox<T extends SingleData>({data, singleDataType, singleDataId, keycloakReady, showDialog}: DetailsBoxProps<T>): JSX.Element {
    const ageLstItemTxt: string = getYearLowHigh(data.ageLow, data.ageHigh, data.ageUnit, data.ageNullCount, "age");
    const diagnosisLstItemTxt: string = getYearLowHigh(data.diagnosisYearLow, data.diagnosisYearHigh, [], data.diagnosisYearNullCount, "diagnosis year");

    const sex = getEntryWithStudyCnt(data.sex, data.sexCount);
    const modality = getEntryWithStudyCnt(data.modality, data.modalityCount);
    const bodyPart = getEntryWithStudyCnt(data.bodyPart, data.bodyPartCount);
    const manufacturer = getEntryWithStudyCnt(data.manufacturer, data.manufacturerCount);
    return <>
        <p title="The project that this dataset is part of"><b>Project</b><br /><span className="ms-3">{data.project}</span></p>
        { getIDLink(singleDataId, singleDataType, PREVIOUS_ID, data.previousId, 
            data.editablePropertiesByTheUser.includes("previousId"),
            data, showDialog, keycloakReady) }
        { getIDLink(singleDataId, singleDataType, NEXT_ID, data.nextId, false) }
        <p title="The number of studies followed by number of all subjects in this dataset"><b>Studies/Subjects count</b><br />
          <span className="ms-3">{data.studiesCount}/{data.subjectsCount}</span></p>
        <p title="The range of the ages of all subjects in this dataset, DICOM tag (0010, 1010) or subject clinical data"><b>Age range</b><br />
          <span className="ms-3">{ageLstItemTxt}</span></p>
        <p title="The range of the diagnosis years for all subjects in this dataset, subject clinical data"><b>Year of diagnosis range</b><br />
          <span className="ms-3">{diagnosisLstItemTxt}</span></p>
        <p title="The set of sexes of all subjects in this dataset, DICOM tag (0010, 0040) or subject clinical data"><b>Sex{sex.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{sex.txt}</span></p>
        <p title="The set of modalities used to generate the images in this dataset, DICOM tag (0008, 0060)"><b>Modality{modality.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{modality.txt}</span></p>
        <p title="The set of manufacturers of the equipment used to produce the data, Dicom tag (0008,0070)"><b>Manufacturer{manufacturer.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{manufacturer.txt}</span></p>
        <p title="The various body parts represented by the underlying studies, DICOM tag (0018, 0015)"><b>Body part{bodyPart.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{bodyPart.txt}</span></p>
        <p title="The list of tags set on the series that compose this dataset"><b>Series tags</b><br />
          <span className="ms-3">{data.seriesTags !== null && data.seriesTags !== undefined && data.seriesTags.length > 0 ? 
          data.seriesTags.map(t => <Badge pill key={t} bg="light" text="dark" className="ms-1 me-1">{t}</Badge>) : "-"}</span></p>
        <p title={`The type of the dataset (any of the following values: ${Object.values(SingleDataTypeApiType).join(", ")})`}><b>Type</b>
          {
            data.editablePropertiesByTheUser.includes("type") 
                ? <GenericFieldEdit 
                    oldValue={data.typeApi} field="typeApi" 
                    keycloakReady={keycloakReady} 
                    fieldDisplay="type"
                    showDialog={showDialog}
                    patchMutation={usePatchSingleDataMutation}
                    patchExternalFields={{
                        id: data.id,
                        singleDataType
                    }}
                    spec={BodyFactorySpecType.SINGLEDATA}/>
            : <></>
          }
          <br />
          <span className="ms-3">{data.typeApi !== null && data.typeApi !== undefined && data.typeApi.length > 0 ? 
          data.typeApi.map(t => <Badge pill key={t} bg="light" text="dark" className="ms-1 me-1">{t}</Badge>) : "-"}</span></p>
        <p title={`The collection method used to gather the data for the dataset (any of the following values: ${Object.values(CollectionMethodType).join(", ")})`}>
          <b>Collection method</b>
          {
            data.editablePropertiesByTheUser.includes("collectionMethod") 
                ? <GenericFieldEdit 
                    oldValue={data.collectionMethod} field="collectionMethod" 
                    keycloakReady={keycloakReady} 
                    fieldDisplay="collection method"
                    showDialog={showDialog}
                    patchMutation={usePatchSingleDataMutation}
                    patchExternalFields={{
                        id: data.id,
                        singleDataType
                    }}
                    spec={BodyFactorySpecType.SINGLEDATA}/>
            : <></>
          }
          <br />
          <span className="ms-3">{data.collectionMethod !== null && data.collectionMethod !== undefined && data.collectionMethod.length > 0 ? 
          data.collectionMethod.map(t => <Badge pill key={t} bg="light" text="dark" className="ms-1 me-1">{t}</Badge>) : "-"}</span></p>
    </>
}

export default DetailsBox;
export {getEntryWithStudyCnt};