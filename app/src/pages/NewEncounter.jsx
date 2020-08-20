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
      <EncounterForm handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewEncounter;
