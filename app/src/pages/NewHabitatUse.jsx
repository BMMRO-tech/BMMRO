/** @jsx jsx */
import { jsx } from "@emotion/core";
import { navigate } from "@reach/router";
import { useEffect, useContext } from "react";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { CollectionNames } from "../constants/datastore";
import { ROUTES } from "../constants/routes";
import clientPersistence from "../clientPersistence/clientPersistence";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";

const NewHabitatUse = () => {
  const openEncounterPath = clientPersistence.get("openEncounterPath");
  const { datastore } = useContext(FirebaseContext);

  const handleSubmit = (values) => {
    datastore.createSubDoc(
      openEncounterPath,
      CollectionNames.HABITAT_USE,
      values
    );
    navigate(ROUTES.openEncounter);
  };

  useEffect(() => {
    if (!openEncounterPath) {
      navigate(ROUTES.newEncounter);
    }
  }, [openEncounterPath]);

  return (
    <Layout hasDefaultPadding={false}>
      <HabitatUseForm handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewHabitatUse;
