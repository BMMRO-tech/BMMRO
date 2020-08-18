/** @jsx jsx */
import { useContext } from "react";
import { FirebaseContext } from "./firebaseContext/firebaseContext";
import { jsx } from "@emotion/core";
import { LocationProvider, Router } from "@reach/router";
import { ROUTES } from "./constants/routes";
import NewHabitatUse from "./pages/NewHabitatUse";
import NewEncounter from "./pages/NewEncounter";
import OpenEncounter from "./pages/OpenEncounter";
import Login from "./pages/Login";
import { FirebaseContextProvider } from "./firebaseContext/firebaseContext";
import { useLogoutRedirect } from "./hooks/useLogoutRedirect";
import EditHabitatUse from "./pages/EditHabitatUse";
import EditEncounter from "./pages/EditEncounter";

const AppWithoutContext = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLogoutRedirect(loggedInUser);

  return (
    <Router>
      <Login path={ROUTES.login} />
      <NewEncounter default path={ROUTES.newEncounter} />
      <OpenEncounter path={ROUTES.openEncounter} />
      <EditEncounter path={ROUTES.editEncounter} />
      <NewHabitatUse path={ROUTES.newHabitatUse} />
      <EditHabitatUse path={ROUTES.editHabitatUse} />
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
