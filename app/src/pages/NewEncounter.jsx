/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";

const NewEncounter = () => {
  return (
    <Layout>
      <EncounterForm />
    </Layout>
  );
};

export default NewEncounter;
