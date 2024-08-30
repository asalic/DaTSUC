import DatasetLicense from "./DatasetLicense";
import DatasetPids from "./DatasetPids";
import SingleDataType from "./SingleDataType";

export default class SingleData {

    type: SingleDataType;
    id: string;
    name: string;
    previousId: string | null;
    nextId: string | null;
    authorId: string;
    authorName: string | null;
    authorEmail: string | null;
    creationDate: string;
    description: string;
    license: DatasetLicense;
    pids: DatasetPids;
    contactInfo: string | null;
    draft: boolean;
    creating: boolean;
    public: boolean;
    invalidated: boolean;
    corrupted: boolean;
    editablePropertiesByTheUser: string[];
    allowedActionsForTheUser: string[];
    studiesCount: number;
    subjectsCount: number;
    ageLow: number | null;
    ageHigh: number | null;
    ageUnit: string[];
    ageNullCount: number;
    sex: string[];
    sexCount: number[];
    bodyPart: string[];
    bodyPartCount: number[];
    modality: string[];
    modalityCount: number[];
    manufacturer: string[];
    manufacturerCount: number[];
    diagnosisYearLow: number | null;
    diagnosisYearHigh: number | null;
    diagnosisYearNullCount: number | null;
    seriesTags: string[];
    sizeInBytes: number | null; 
    lastIntegrityCheck:  string | null;
    project: string;

}