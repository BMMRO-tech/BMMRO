/** @jsx jsx */
import {jsx} from "@emotion/core";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout hasDefaultPadding={false}>
      <p>
        Something went wrong. Please use the tabs to navigate to the trips or
        encounters.
      </p>
    </Layout>
  );
};

export default NotFound;
