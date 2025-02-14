import ItemPage from "./ItemPage";
import Study from "./Study";
import SingleData from "./SingleData";

export default interface Dataset extends SingleData {
    diagnosis: string[];
    diagnosisCount: number[];
    provenance: string;
    studies: ItemPage<Study>;
}