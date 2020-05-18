/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext, useEffect, useState } from "react";
import { Router, navigate } from "@reach/router";

import Landing from "./pages/Landing";
import Error from "./pages/Error";
import HabitatUse from "./pages/HabitatUse";
import { config, initFirestore, Datastore } from "./datastore/datastore";

export const DatastoreContext = createContext();

const App = () => {
  const [datastore, setDatastore] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const firestore = new Datastore(initFirestore(config));

        await firestore.enableOfflineStorage();
        setDatastore(firestore);
      } catch (e) {
        navigate("/error", { state: { error: e.message } });
      }
    })();
  }, []);

  return (
    <DatastoreContext.Provider value={datastore}>
      <Router>
        <Landing path="/" />
        <HabitatUse path="/habitat" />
        <Error path="/error" />
      </Router>
    </DatastoreContext.Provider>
  );
};

export default App;
