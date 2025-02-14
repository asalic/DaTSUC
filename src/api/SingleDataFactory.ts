import SingleData from "../model/SingleData";
import SingleDataType from "../model/SingleDataType";

export default class SingleDataFactory {

    public static fromObj(obj: any, singleDataType: SingleDataType): SingleData {
        const r: SingleData = structuredClone(obj);
        r["typeApi"] = obj["type"];
        r["type"] = singleDataType;
        return r as SingleData;
    }

    public static apiFieldName(fieldName: string): string {
        if (fieldName === "typeApi") {
          return "type";
        }  else { 
          return fieldName;
        }
    }

    public static getTypeName(singleDataType: SingleDataType): string | null {
      switch (singleDataType) {
        case SingleDataType.DATASET: return "dataset";
        case SingleDataType.MODEL: return "model";
        default: return null;
      }
    }
}