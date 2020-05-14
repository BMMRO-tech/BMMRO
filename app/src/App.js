/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext } from "react";

import Layout from "./components/Layout";
import HabitatUseForm from "./components/HabitatUseForm";
import { config, initFirestore, Datastore } from "./datastore/datastore";

const datastore = new Datastore(initFirestore(config));
datastore.enableOfflineStorage();
export const DatastoreContext = createContext(datastore);

const App = () => {
  return (
    <DatastoreContext.Provider value={datastore}>
      <Layout>
        <HabitatUseForm />
      </Layout>
    </DatastoreContext.Provider>
  );
};

export default App;
