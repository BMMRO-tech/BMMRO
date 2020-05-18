/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "@reach/router";

import Layout from "../components/Layout";
import Button from "../components/Button";
import { DatastoreErrorType } from "../datastore/constants";

const Error = ({ location }) => {
  const message = {
    [DatastoreErrorType.UNKNOWN_OFFLINE_SUPPORT]:
      "Unknown error. Please try refreshing the app.",
    [DatastoreErrorType.MULTIPLE_TABS]:
      "The app is open in multiple tabs. Please close other tabs to enable offline storage and hit the button below.",
    [DatastoreErrorType.BROWSER_NOT_SUPPORTED]:
      "Your current browser is not supported. Please open the app in Chrome, Safari or Firefox.",
  };

  return (
    <Layout>
      <h1>Error</h1>
      <h3>{message[location.state.error]}</h3>
      <Link to="/">
        <Button>Go back to the homepage</Button>
      </Link>
    </Layout>
  );
};

export default Error;
