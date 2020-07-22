/** @jsx jsx */
import { useContext } from "react";
import { FirebaseContext } from "./firebaseContext/firebaseContext";
import { jsx } from "@emotion/core";
import { LocationProvider, Router } from "@reach/router";
import { ROUTES } from "./constants/routes";
import NewHabitatUse from "./pages/NewHabitatUse";
import OpenEncounter from "./pages/OpenEncounter";
import Login from "./pages/Login";
import { FirebaseContextProvider } from "./firebaseContext/firebaseContext";
import { useLogoutRedirect } from "./hooks/useLogoutRedirect";

const AppWithoutContext = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLogoutRedirect(loggedInUser);

  return (
    <Router>
      <Login path={ROUTES.login} />
      <NewHabitatUse path={ROUTES.habitat} />
      <OpenEncounter path={ROUTES.openEncounter} />
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
