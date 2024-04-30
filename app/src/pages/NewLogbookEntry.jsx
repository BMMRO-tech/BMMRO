/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Layout from "../components/Layout";
import Tabs from "../components/Tabs";

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
        {/*<h1 css={utilities.form.title}>New Logbook Entry</h1>*/}
      </div>
      <p>
        Work in progress. Please click on the "ENCOUNTERS" tab to use the app as
        usual.
      </p>
      <p>ENCOUNTERS</p>
    </Layout>
  );
};
export default NewLogbookEntry;
