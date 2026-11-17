import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { registerSW } from "virtual:pwa-register";
import firebase from "firebase/compat/app";
// Self-hosted so the fonts are precached by the service worker and look the
// same offline. latin-ext covers accented characters.
import "@fontsource/open-sans/latin-400.css";
import "@fontsource/open-sans/latin-600.css";
import "@fontsource/open-sans/latin-700.css";
import "@fontsource/open-sans/latin-400-italic.css";
import "@fontsource/open-sans/latin-ext-400.css";
import "@fontsource/open-sans/latin-ext-600.css";
import "@fontsource/open-sans/latin-ext-700.css";
import "@fontsource/open-sans/latin-ext-400-italic.css";

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_API_KEY,
  authDomain: import.meta.env.REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

// Registers the generated service worker (production builds only).
registerSW();
