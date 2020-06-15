/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "@reach/router";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { useContext } from "react";
import { FirebaseContext } from "../firebaseContext/firebaseContext";

const Landing = () => {
  const { loggedInUser } = useContext(FirebaseContext);

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
    </Layout>
  );
};

export default Landing;
