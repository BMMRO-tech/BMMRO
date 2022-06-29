/** @jsx jsx */
import { useContext } from "react";
import { jsx } from "@emotion/core";
import { LocationProvider, Router } from "@reach/router";

import {
  FirebaseContext,
  FirebaseContextProvider,
} from "./firebaseContext/firebaseContext";
import { useLogoutRedirect } from "./hooks/useLogoutRedirect";
import { ROUTES } from "./constants/routes";
import Login from "./pages/Login";
import Encounters from "./pages/Encounters";
import NewEncounter from "./pages/NewEncounter";
import OpenEncounter from "./pages/OpenEncounter";
import ViewEncounter from "./pages/ViewEncounter";
import EditEncounter from "./pages/EditEncounter";
import NewHabitatUse from "./pages/NewHabitatUse";
import ViewHabitatUse from "./pages/ViewHabitatUse";
import EditHabitatUse from "./pages/EditHabitatUse";
import NewBiopsy from "./pages/NewBiopsy";

const AppWithoutContext = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLogoutRedirect(loggedInUser);

  return (
    <Router>
      <Login path={ROUTES.login} />
      <NewEncounter path={ROUTES.newEncounter} />
      <OpenEncounter path={ROUTES.openEncounter} />
      <EditEncounter path={ROUTES.editEncounter} />
      <ViewEncounter path={ROUTES.viewEncounter} />
      <NewHabitatUse path={ROUTES.newHabitatUse} />
      <EditHabitatUse path={ROUTES.editHabitatUse} />
      <ViewHabitatUse path={ROUTES.viewHabitatUse} />
      <NewBiopsy path={ROUTES.newBiopsy} />
      <Encounters default path={ROUTES.encounters} />
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
