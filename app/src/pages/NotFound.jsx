/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Layout from "../components/Layout";
import Tabs from "../components/Tabs";

const NotFound = () => {
  const styles = {
    tabContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    `,
    list: css`
      margin: 10px 10px 30px 10px;
    `,
  };

  return (
    <Layout hasDefaultPadding={false}>
      <div css={styles.tabContainer}>
        <Tabs />
      </div>
      <p>
        Something went wrong. Please use the tabs to navigate to the trips or
        encounters.
      </p>
    </Layout>
  );
};

export default NotFound;
