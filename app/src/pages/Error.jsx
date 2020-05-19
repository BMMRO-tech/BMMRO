/** @jsx jsx */
import { jsx } from "@emotion/core";

import { Fragment } from "react";
import Button from "../components/Button";
import { DatastoreErrorType } from "../datastore/constants";

const Error = ({ type }) => {
  const message = {
    [DatastoreErrorType.UNKNOWN_OFFLINE_SUPPORT]:
      "Unknown error. Please try refreshing the app.",
    [DatastoreErrorType.MULTIPLE_TABS]:
      "The app is open in multiple tabs. Please close other tabs to enable offline storage and hit the 'Refresh' button below.",
    [DatastoreErrorType.BROWSER_NOT_SUPPORTED]:
      "Your current browser is not supported. Please open the app in Chrome, Safari or Firefox.",
  };

  return (
    <Fragment>
      <h1>Error</h1>
      <h3>{message[type]}</h3>
      <Button onClick={() => window.location.reload()}>Refresh</Button>
    </Fragment>
  );
};

export default Error;
