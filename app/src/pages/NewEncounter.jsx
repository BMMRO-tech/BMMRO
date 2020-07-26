/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";

const NewEncounter = () => {
  return (
    <Layout hasDefaultPadding={false}>
      <EncounterForm />
    </Layout>
  );
};

export default NewEncounter;
