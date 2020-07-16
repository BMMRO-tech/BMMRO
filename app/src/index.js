import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import firebase from "firebase/app";
import UpdateAvailableContainer from "./UpdateAvailableContainer";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <UpdateAvailableContainer>
      <App />
    </UpdateAvailableContainer>
  </React.StrictMode>,
  document.getElementById("root")
);
