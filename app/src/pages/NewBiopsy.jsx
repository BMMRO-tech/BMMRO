/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { useContext } from "react";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import BiopsyForm from "../components/BiopsyForm";
import { useNavigate } from "@reach/router";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import {
  CollectionNames,
  generateEncounterPath,
  generateBiopsyPath,
} from "../constants/datastore";
import { generateOpenEncounterURL } from "../constants/routes";

const NewBiopsy = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const encounterPath = generateEncounterPath(encounterId);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const specimens = values.specimens;
    let valuesToSubmit = { ...values };

    delete valuesToSubmit.specimens;
    const id = datastore.createSubDoc(
      encounterPath,
      CollectionNames.BIOPSY,
      valuesToSubmit
    );
    const biopsyPath = generateBiopsyPath(encounterId, id);

    for (const specimen of specimens) {
      if (
        specimen.specimenNumber ||
        specimen.sampleType ||
        specimen.storageType
      ) {
        datastore.createSubDoc(biopsyPath, CollectionNames.SPECIMEN, specimen);
      }
    }

    navigate(generateOpenEncounterURL(encounterId));
  };

  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>Add New Biopsy Record</h1>
      <BiopsyForm encounterId={encounterId} handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewBiopsy;
