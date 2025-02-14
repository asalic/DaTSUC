import License from "../License";

export default interface ProjectConfig {
    defaultContactInfo?: string;
    defaultLicense?: License;
    zenodoAccessToken?: string;
    zenodoAuthor?: string;
    zenodoCommunity?: string;
    zenodoGrant?: string;
}