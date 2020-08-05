/** @jsx jsx */
import { jsx } from "@emotion/core";
import { navigate } from "@reach/router";
import { useEffect, useContext } from "react";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { ROUTES } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
import clientPersistence from "../clientPersistence/clientPersistence";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";

const NewHabitatUse = () => {
  const { datastore } = useContext(FirebaseContext);
  const openEncounterPath = clientPersistence.get("openEncounterPath");

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
