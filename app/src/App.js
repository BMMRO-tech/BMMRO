import { useContext } from "react";
import { jsx } from "@emotion/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import EditBiopsy from "./pages/EditBiopsy";
import ViewBiopsy from "./pages/ViewBiopsy";
import Trips from "./pages/Trips";
import NewTrip from "./pages/NewTrip";
import { MonthProvider } from "./providers/monthContext/MonthContext";
import NewLogbookEntry from "./pages/NewLogbookEntry";
import NotFound from "./pages/NotFound";
import ViewTrip from "./pages/ViewTrip";
import EditTrip from "./pages/EditTrip";
import EditLogbookEntry from "./pages/EditLogbookEntry";

const AppWithoutContext = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  useLogoutRedirect(loggedInUser);

  return (
    <Routes>
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.newEncounter} element={<NewEncounter />} />
      <Route path={ROUTES.openEncounter} element={<OpenEncounter />} />
      <Route path={ROUTES.editEncounter} element={<EditEncounter />} />
      <Route path={ROUTES.viewEncounter} element={<ViewEncounter />} />
      <Route path={ROUTES.newHabitatUse} element={<NewHabitatUse />} />
      <Route path={ROUTES.editHabitatUse} element={<EditHabitatUse />} />
      <Route path={ROUTES.viewHabitatUse} element={<ViewHabitatUse />} />
      <Route path={ROUTES.newBiopsy} element={<NewBiopsy />} />
      <Route path={ROUTES.editBiopsy} element={<EditBiopsy />} />
      <Route path={ROUTES.viewBiopsy} element={<ViewBiopsy />} />
      <Route path={ROUTES.encounters} element={<Encounters />} />
      <Route path={ROUTES.trips} element={<Trips />} />
      <Route path={ROUTES.newTrip} element={<NewTrip />} />
      <Route path={ROUTES.editTrip} element={<EditTrip />} />
      <Route path={ROUTES.viewTrip} element={<ViewTrip />} />
      <Route path={ROUTES.newLogbookEntry} element={<NewLogbookEntry />} />
      <Route path={ROUTES.editLogbookEntry} element={<EditLogbookEntry />} />
      <Route path={ROUTES.notFound} element={<NotFound />} />
    </Routes>
  );
};

export default () => {
  return (
    <FirebaseContextProvider>
      <MonthProvider>
        <AppWithoutContext />
      </MonthProvider>
    </FirebaseContextProvider>
  );
};
