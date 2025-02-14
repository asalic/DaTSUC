import ProjectConfig from "./ProjectConfig";

export interface  ProjectFull {

    code: string;
    name: string;
    logoUrl: string;
    shortDescription: string;
    externalUrl: string;
    projectConfig: ProjectConfig
}