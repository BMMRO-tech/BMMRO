/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext, useEffect, useState } from "react";
import { Router } from "@reach/router";

import Landing from "./pages/Landing";
import HabitatUse from "./pages/HabitatUse";
import { config, initFirestore, Datastore } from "./datastore/datastore";

export const DatastoreContext = createContext();

const App = () => {
  const [datastore, setDatastore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const firestore = new Datastore(initFirestore(config));

        await firestore.enableOfflineStorage();
        setDatastore(firestore);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  return (
    <DatastoreContext.Provider value={{ datastore, error }}>
      <Router>
        <Landing path="/" />
        <HabitatUse path="/habitat" />
      </Router>
    </DatastoreContext.Provider>
  );
};

export default App;
