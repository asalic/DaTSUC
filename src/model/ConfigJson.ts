import ExternalService from "./ExternalService";

interface KeycloakConfigOptions {
    responseMode: string;
    checkLoginIframe: boolean;
    onLoad: string;
}

interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}

interface KeycloakOpts {
    config: KeycloakConfig;
    initOptions: KeycloakConfigOptions;
}

interface DatasetService {
    api:  string;
    projectLogo: string;
}

export default interface ConfigJson {

    appVersion: string;
    release: string;
    datasetService: DatasetService;
    tracerService: string | null | undefined;
    basename: string;
    defaultLimitDatasets: number;
    defaultLimitStudies: number;
    defaultLimitTraces: number;
    userAccountUrl: string;
    refreshDatasetCreate: number;
    keycloak: KeycloakOpts;
    externalServices?: ExternalService[];
    appsDashboard: string;

}