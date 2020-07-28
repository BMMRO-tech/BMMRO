/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import { navigate } from "@reach/router";

import { ROUTES } from "../constants/routes";
import clientPersistence from "../clientPersistence/clientPersistence";
import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";

const NewEncounter = () => {
  useEffect(() => {
    const encounterPath = clientPersistence.get("openEncounterPath");

    if (encounterPath) {
      navigate(ROUTES.openEncounter);
    }
  }, []);

  return (
    <Layout hasDefaultPadding={false}>
      <EncounterForm />
    </Layout>
  );
};

export default NewEncounter;
