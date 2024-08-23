import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

// Careful with the order of CSS loading, if you want to modify Bootstrap's settings
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import AppKeycloak from './AppKeycloak';
import reportWebVitals from './reportWebVitals';
import Config from "./config.json";
import {store} from "./store";

//const Loading = () => <div>Loading, please wait...</div>

function favicon(rel: string, iconPath: string): void {
      var link: HTMLLinkElement = document.querySelector(`link[rel*='${rel}']`) || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = process.env["PUBLIC_URL"] + iconPath;
      document?.getElementsByTagName('head')[0]?.appendChild(link);
}
if (Config.project?.favicon) {
      favicon("icon", Config.project.favicon);
      favicon("apple-touch-icon", Config.project.favicon);
}

const domNode: HTMLElement | null = document.getElementById('root');
if (domNode) {
      const root = createRoot(domNode);
      root.render(
            <Provider store={store}>
                  <AppKeycloak />
            </Provider>
      );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
