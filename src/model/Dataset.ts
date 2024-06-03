import ItemPage from "./ItemPage";
import Study from "./Study";
import SingleData from "./SingleData";

export default class Dataset extends SingleData {
    studies: ItemPage<Study>;
}