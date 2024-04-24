import DialogSize from "./DialogSize";


export default interface DialogSettings {
    body: JSX.Element;
    footer: JSX.Element;
    title: JSX.Element;
    onBeforeClose: Function | null;
    scrollable: boolean;
    size: DialogSize;
    show: boolean;

}