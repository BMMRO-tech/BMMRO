/** @jsx jsx */
import { jsx } from "@emotion/core";
import { navigate } from "@reach/router";
import { useEffect } from "react";

import { ROUTES } from "../constants/routes";
import clientPersistence from "../clientPersistence/clientPersistence";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";

const NewHabitatUse = () => {
  const openEncounterPath = clientPersistence.get("openEncounterPath");
  const openEncounterStartTimestamp = clientPersistence.get(
    "openEncounterStartTimestamp"
  );

  useEffect(() => {
    if (!openEncounterPath) {
      navigate(ROUTES.newEncounter);
    }
  }, [openEncounterPath]);

  return (
    <Layout hasDefaultPadding={false}>
      <HabitatUseForm
        encounterPath={openEncounterPath}
        encounterStartTimestamp={openEncounterStartTimestamp}
      />
    </Layout>
  );
};

export default NewHabitatUse;
