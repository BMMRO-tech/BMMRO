/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Layout from "../components/Layout";
import Tabs from "../components/Tabs";
import utilities from "../materials/utilities";

const NewLogbookEntry = ({ tripId }) => {
  const styles = {
    tabContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    `,
  };
  return (
    <Layout hasDefaultPadding={false}>
      <div css={styles.tabContainer}>
        <Tabs />
      </div>
      <p>
        <span>
          <h1 css={utilities.form.title}>New Logbook Entry</h1>
        </span>
        Work in progress. Please click on the "ENCOUNTERS" tab to use the app as
        usual.
      </p>
    </Layout>
  );
};
export default NewLogbookEntry;
