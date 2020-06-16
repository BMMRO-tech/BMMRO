/** @jsx jsx */
import { useContext } from "react";
import { FirebaseContext } from "./firebaseContext/firebaseContext";
import { jsx } from "@emotion/core";
import { LocationProvider, Router } from "@reach/router";

import Landing from "./pages/Landing";
import HabitatUse from "./pages/HabitatUse";
import Login from "./pages/Login";

import { FirebaseContextProvider } from "./firebaseContext/firebaseContext";
import { useLogoutRedirect } from "./hooks/useLogoutRedirect";

const AppWithoutContext = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLogoutRedirect(loggedInUser);

  return (
    <Router>
      <Landing path="/" />
      <Login path="/login" />
      <HabitatUse path="/habitat" />
    </Router>
  );
};

export default () => {
  return (
    <FirebaseContextProvider>
      <LocationProvider>
        <AppWithoutContext />
      </LocationProvider>
    </FirebaseContextProvider>
  );
};
