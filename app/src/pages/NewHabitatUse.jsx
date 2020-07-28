/** @jsx jsx */
import { jsx } from "@emotion/core";
import { navigate } from "@reach/router";
import { useEffect } from "react";

import { ROUTES } from "../constants/routes";
import clientPersistence from "../clientPersistence/clientPersistence";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";

const NewHabitatUse = () => {
  useEffect(() => {
    const openEncounterPath = clientPersistence.get("openEncounterPath");

    if (!openEncounterPath) {
      navigate(ROUTES.newEncounter);
    }
  }, []);

  return (
    <Layout hasDefaultPadding={false}>
      <HabitatUseForm />
    </Layout>
  );
};

export default NewHabitatUse;
