/** @jsx jsx */
import { jsx } from "@emotion/core";

import { Fragment } from "react";
import Button from "./Button";
import getErrorMessage from "../utils/getErrorMessage";

const Error = ({ type }) => {
  return (
    <Fragment>
      <h1>Error</h1>
      <h3>{getErrorMessage(type)}</h3>
      <Button onClick={() => window.location.reload()}>Refresh</Button>
    </Fragment>
  );
};

export default Error;
