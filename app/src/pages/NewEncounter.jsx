/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext } from "react";
import { navigate } from "@reach/router";

import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { generateOpenEncounterURL } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
import { RESEARCH_ASSISTANT } from "../constants/formOptions/roles";

const NewEncounter = () => {
  const { datastore } = useContext(FirebaseContext);

  const handleSubmit = (values) => {
    const id = datastore.createDoc(CollectionNames.ENCOUNTER, values);
    navigate(generateOpenEncounterURL(id));
  };

  return (
    <Layout hasDefaultPadding={false}>
      <EncounterForm handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewEncounter;
