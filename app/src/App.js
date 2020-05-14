/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext } from "react";
import { Router } from "@reach/router";

import Landing from "./pages/Landing";
import { config, initFirestore, Datastore } from "./datastore/datastore";
import HabitatUse from "./pages/HabitatUse";

const datastore = new Datastore(initFirestore(config));
datastore.enableOfflineStorage();
export const DatastoreContext = createContext(datastore);

const App = () => {
  return (
    <DatastoreContext.Provider value={datastore}>
      <Router>
        <Landing path="/" />
        <HabitatUse path="/habitat" />
      </Router>
    </DatastoreContext.Provider>
  );
};

export default App;
