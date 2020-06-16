/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link, navigate } from "@reach/router";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { useContext, useState } from "react";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import firebaseApp from "../firebaseContext/firebase";
import { AuthenticationErrorType } from "../constants/authentication";
import ErrorMessage from "../components/ErrorMessage";

const Landing = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  const [logoutError, setLogoutError] = useState(null);

  const logout = () => {
    firebaseApp
      .auth()
      .signOut()
      .then(() => navigate("/login"))
      .catch(() =>
        setLogoutError({ type: AuthenticationErrorType.UNSUCCESSFUL_LOGOUT })
      );
  };

  return (
    <Layout>
      <h1>Welcome to BMMRO</h1>
      {loggedInUser ? (
        <p data-testid="welcome-text">
          You are logged in as {loggedInUser.email}
        </p>
      ) : null}
      <Link to="habitat">
        <Button>Record Habitat Use</Button>
      </Link>
      <Button onClick={logout} testId="logout-button">
        Logout
      </Button>
      {!!logoutError && (
        <ErrorMessage error={logoutError} testId="logout-error" />
      )}
    </Layout>
  );
};

export default Landing;
