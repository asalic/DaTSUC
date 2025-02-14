import React from "react";
import BodyFactorySpecType from "../../../model/BodyFactorySpecType";
import Body from "./Body";
import ErrorView from "../ErrorView";
import SingleDataTypeApiType from "../../../model/SingleDataTypeApiType";
import BodyLicense from "../../data/common/single/common/fieldedit/BodyLicense";
import BodyPid from "../../data/common/single/common/fieldedit/BodyPid";
import BodyId from "../../data/common/single/common/fieldedit/BodyId";
import BodyEnumSelect from "../../data/common/single/common/fieldedit/BodyEnumSelect";
import CollectionMethodType from "../../../model/CollectionMethodType";

function bodyFactory(spec: BodyFactorySpecType, field:string, updValue: Function,
        oldValue: any, keycloakReady: boolean, additionalProps?: any): JSX.Element {
    if (spec === BodyFactorySpecType.PROJECT) {
        if (field === "name") {
            return <Body oldValue={oldValue} updValue={updValue} inputType="input-text"/>
        } if (field === "externalUrl")  {
            return <Body oldValue={oldValue} updValue={updValue} inputType="input-url"/>
        } if (field === "shortDescription")  {
            return <Body oldValue={oldValue} updValue={updValue} inputType="textarea"/>
        } else {
            return <Body oldValue={oldValue} updValue={updValue} />
        }
    } else if (spec === BodyFactorySpecType.SINGLEDATA) {
        if (field === "license" || field === "licenseUrl") {
            return <BodyLicense updValue={updValue} oldValue={oldValue} keycloakReady={keycloakReady}/>;
          } else if (field === "pids") {
            return <BodyPid updValue={updValue} oldValue={oldValue} />;
          } else if (field === "previousId") {
            return <BodyId updValue={updValue} oldValue={oldValue} keycloakReady={keycloakReady}
                additionalProps={additionalProps}/>;
          } else if (field === "typeApi") {
            return <BodyEnumSelect updValue={updValue} oldValue={oldValue} allValues={Object.values(SingleDataTypeApiType)}/>;
          } else if (field === "collectionMethod") {
            return <BodyEnumSelect updValue={updValue} oldValue={oldValue} allValues={Object.values(CollectionMethodType)}/>;
          } else if (field === "description" || field === "provenance" || field === "purpose") {
            return <Body updValue={updValue} oldValue={oldValue} inputType="textarea"/>;
          } else {
            return <Body updValue={updValue} oldValue={oldValue} />;
          }
    }  else if (spec === BodyFactorySpecType.DATASET) {
        return <Body updValue={updValue} oldValue={oldValue} />;
    } else {
        return <ErrorView message={`Spec type '${spec}' not handled  by the body factory.`} />
    }
}

export default bodyFactory;