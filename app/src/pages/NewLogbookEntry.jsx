/** @jsx jsx */
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";

const NewLogbookEntry = ({ tripId }) => {
  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>New Logbook Entry</h1>
      <p>
        Work in progress. Please click on the "ENCOUNTERS" tab to use the app as
        usual.
      </p>
    </Layout>
  );
};
export default NewLogbookEntry;
