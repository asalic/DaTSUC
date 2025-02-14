import React from "react";
import BodyFactorySpecType from "../../../model/BodyFactorySpecType";
import Body from "./Body";
import ErrorView from "../ErrorView";

function bodyFactory<M>(spec: BodyFactorySpecType, field:string, updValue: Function,
        oldValue: string | null |undefined, keycloakReady: boolean, additionalProps?: M): JSX.Element {
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
    }  else {
        return <ErrorView message={`Spec type '${spec}' not handled  by the body factory.`} />
    }
}

export default bodyFactory;