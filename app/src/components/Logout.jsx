/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import firebaseApp from "../firebaseContext/firebase";
import { AuthenticationErrorType } from "../constants/authentication";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { Fragment, useState, useContext } from "react";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

const Logout = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  const [logoutError, setLogoutError] = useState(null);

  const logout = () => {
    firebaseApp
      .auth()
      .signOut()
      .catch(() =>
        setLogoutError({ type: AuthenticationErrorType.UNSUCCESSFUL_LOGOUT })
      );
  };

  const styles = {
    text: css`
      padding-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
  };

  return (
    <Fragment>
      <div css={styles.text} data-testid="user-email">
        {loggedInUser?.email}
      </div>
      <Button width="100%" onClick={logout} testId="logout-button">
        Logout
      </Button>
      {!!logoutError && (
        <ErrorMessage error={logoutError} testId="logout-error" />
      )}
    </Fragment>
  );
};

export default Logout;
