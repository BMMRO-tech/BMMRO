/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import BiopsyForm from "../components/BiopsyForm";

const NewBiopsyForm = ({ encounterId }) => {
  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>Add New Biopsy Record</h1>
        <BiopsyForm encounterId={encounterId}/>
    </Layout>
  );
};

export default NewBiopsyForm;
