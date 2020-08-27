/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext } from "react";
import { navigate } from "@reach/router";

import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { generateOpenEncounterURL, ROUTES } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
import { FormSubmitType } from "../constants/forms";
import utilities from "../materials/utilities";

const NewEncounter = () => {
  const { datastore } = useContext(FirebaseContext);

  const handleSubmit = (submitType, values) => {
    const id = datastore.createDoc(CollectionNames.ENCOUNTER, values);

    if (submitType === FormSubmitType.SAVE_AND_END) {
      navigate(ROUTES.encounters);
    } else if (submitType === FormSubmitType.SAVE) {
      navigate(generateOpenEncounterURL(id));
    }
  };

  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>New Encounter</h1>
      <EncounterForm handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewEncounter;
