import Keycloak from 'keycloak-js';
import config from "./service/config";

const keycloak = new Keycloak(config.keycloak.config);

//keycloak.init(Config.keycloak.initOptions);

export default keycloak;
