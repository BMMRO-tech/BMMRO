/** @jsx jsx */
import { jsx } from "@emotion/core";
import { navigate } from "@reach/router";
import { useContext } from "react";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { CollectionNames } from "../constants/datastore";
import { generateOpenEncounterURL } from "../constants/routes";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";

const NewHabitatUse = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);

  const handleSubmit = (values) => {
    datastore.createSubDoc(
      `${CollectionNames.ENCOUNTER}/${encounterId}`,
      CollectionNames.HABITAT_USE,
      values
    );
    navigate(generateOpenEncounterURL(encounterId));
  };

  return (
    <Layout hasDefaultPadding={false}>
      <HabitatUseForm handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewHabitatUse;
