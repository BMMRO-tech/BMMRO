import { jsx } from "@emotion/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { generateNewHabitatUseURL } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
import utilities from "../materials/utilities";
import NewEncounterForm from "../components/NewEncounterForm";

const NewEncounter = () => {
  const { datastore } = useContext(FirebaseContext);
  let navigate = useNavigate();

  const handleSubmit = (values) => {
    const id = datastore.createDoc(CollectionNames.ENCOUNTER, values);

    navigate(generateNewHabitatUseURL(id));
  };

  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>New Encounter</h1>
      <NewEncounterForm handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewEncounter;
