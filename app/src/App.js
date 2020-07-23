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

  const NewEncounter = () => "New encounter";

  return (
    <Router>
      <Login path={ROUTES.login} />
      <NewEncounter default path={ROUTES.newEncounter} />
      <OpenEncounter path={ROUTES.openEncounter} />
      <NewHabitatUse path={ROUTES.newHabitatUse} />
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
