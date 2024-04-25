/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Tabs from "../components/Tabs";

const Trips = () => {
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
        <Link to={""}>
          <Button isSmall testId={"newTrips"}>
            + New
          </Button>
        </Link>
      </div>
      <p>
        Work in progress. Please click on the "ENCOUNTERS" tab to use the app as
        usual.
      </p>
    </Layout>
  );
};

export default Trips;
