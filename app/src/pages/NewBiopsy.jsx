/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext } from "react";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import BiopsyForm from "../components/BiopsyForm";
import { useNavigate } from "@reach/router";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { CollectionNames, generateEncounterPath } from "../constants/datastore";
import { generateOpenEncounterURL } from "../constants/routes";

const NewBiopsy = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const encounterPath = generateEncounterPath(encounterId);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    datastore.createSubDoc(encounterPath, CollectionNames.BIOPSY, values);
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
