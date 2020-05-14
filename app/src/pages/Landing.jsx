/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Link } from "@reach/router";
import Layout from "../components/Layout";
import Button from "../components/Button";

const Landing = () => {
  return (
    <Layout>
      <h1>Welcome to BMMRO</h1>
      <Link to="habitat">
        <Button>Record Habitat Use</Button>
      </Link>
    </Layout>
  );
};

export default Landing;
