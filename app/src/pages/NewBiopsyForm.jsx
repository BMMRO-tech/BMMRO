/** @jsx jsx */
import { jsx } from "@emotion/core";
import Button from "../components/Button";
import { Link } from "@reach/router";
import { generateOpenEncounterURL } from "../constants/routes";
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
