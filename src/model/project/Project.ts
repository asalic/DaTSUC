

export default interface Project {

    code: string;
    name: string;
    logoUrl: string;
    shortDescription: string;
    externalUrl?: string | null;
    editablePropertiesByTheUser: string[];
    allowedActionsForTheUser: string[];

}