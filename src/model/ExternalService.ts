

/**
 * Describes an external service such as Kube Apps.
 * This application only points to that services, the links are not usedinternally in any other part of the program.
 */
export default interface ExternalService {

    name:  string;
    title: string;
    link: string;
    icon: string;
}