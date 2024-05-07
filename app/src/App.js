/** @jsx jsx */
import {useContext} from "react";
import {jsx} from "@emotion/core";
import {LocationProvider, Redirect, Router} from "@reach/router";

import {FirebaseContext, FirebaseContextProvider,} from "./firebaseContext/firebaseContext";
import {useLogoutRedirect} from "./hooks/useLogoutRedirect";
import {ROUTES} from "./constants/routes";
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
import EditBiopsy from "./pages/EditBiopsy";
import ViewBiopsy from "./pages/ViewBiopsy";
import {EncounterMonthProvider} from "./encounterMonthContext/encounterMonthContext";
import Trips from "./pages/Trips";
import NewTrip from "./pages/NewTrip";
import NewLogbookEntry from "./pages/NewLogbookEntry";
import NotFound from "./pages/NotFound";

const AppWithoutContext = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLogoutRedirect(loggedInUser);

  return (
    <Router>
      <Login path={ROUTES.login} />
      <Redirect from="/" to={ROUTES.trips} noThrow />
      <NewEncounter path={ROUTES.newEncounter} />
      <OpenEncounter path={ROUTES.openEncounter} />
      <EditEncounter path={ROUTES.editEncounter} />
      <ViewEncounter path={ROUTES.viewEncounter} />
      <NewHabitatUse path={ROUTES.newHabitatUse} />
      <EditHabitatUse path={ROUTES.editHabitatUse} />
      <ViewHabitatUse path={ROUTES.viewHabitatUse} />
      <NewBiopsy path={ROUTES.newBiopsy} />
      <EditBiopsy path={ROUTES.editBiopsy} />
      <ViewBiopsy path={ROUTES.viewBiopsy} />
      <Encounters path={ROUTES.encounters} />
      <Trips path={ROUTES.trips} />
      <NewTrip path={ROUTES.newTrip} />
      <NewLogbookEntry path={ROUTES.newLogbookEntry} />
      <NotFound default path={ROUTES.notFound} />
    </Router>
  );
};

export default () => {
  return (
    <FirebaseContextProvider>
      <LocationProvider>
        <EncounterMonthProvider>
          <AppWithoutContext />
        </EncounterMonthProvider>
      </LocationProvider>
    </FirebaseContextProvider>
  );
};
