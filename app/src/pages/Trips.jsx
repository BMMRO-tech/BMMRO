/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Layout from "../components/Layout";

const Trips = () => {
  const styles = {
    list: css`
      margin: 10px 10px 30px 10px;
    `,
  };

  return (
    <Layout hasDefaultPadding={false}>
      <div css={styles.container}>
        <p>
          Work in progress. Please click on the "ENCOUNTERS" tab to use the app
          as usual.
        </p>
      </div>
    </Layout>
  );
};

export default Trips;
