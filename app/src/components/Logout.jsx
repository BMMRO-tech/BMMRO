/** @jsx jsx */
import { jsx } from "@emotion/core";
import firebaseApp from "../firebaseContext/firebase";
import { AuthenticationErrorType } from "../constants/authentication";
import { Fragment, useState } from "react";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

const Logout = () => {
  const [logoutError, setLogoutError] = useState(null);

  const logout = () => {
    firebaseApp
      .auth()
      .signOut()
      .catch(() =>
        setLogoutError({ type: AuthenticationErrorType.UNSUCCESSFUL_LOGOUT })
      );
  };

  return (
    <Fragment>
      <Button onClick={logout} testId="logout-button">
        Logout
      </Button>
      {!!logoutError && (
        <ErrorMessage error={logoutError} testId="logout-error" />
      )}
    </Fragment>
  );
};

export default Logout;
