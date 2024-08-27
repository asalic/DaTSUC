import SingleDataType from "../model/SingleDataType";
import Util from "../Util";

/**
 * this class generates various links used around the web app, EXCEPT those used to call the API
 */
export default class UrlFactory {

    public static singleDataDetails(id: string, singleDataType: SingleDataType): string {
        return `/${Util.singleDataPath(singleDataType)}/${id}/details`
    }
}