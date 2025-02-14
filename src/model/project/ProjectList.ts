import ProjectListItem from "./ProjectListItem";

export default interface ProjectList {
    allowedActionsForTheUser: string[];
    list: ProjectListItem[];
}