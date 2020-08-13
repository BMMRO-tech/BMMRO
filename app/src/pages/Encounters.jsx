/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { Link } from "@reach/router";
import Layout from "../components/Layout";
import EncounterList from "../components/EncounterList";
import Button from "../components/Button";
import { ROUTES } from "../constants/routes";

const Encounters = () => {
  const styles = {
    titleContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `,
    link: css`
      text-decoration: none;
      margin-left: auto;
      min-height: 44px;
    `,
  };

  return (
    <Layout hasDefaultPadding={false}>
      <div css={styles.titleContainer}>
        <h1>ENCOUNTERS</h1>
        <Link css={styles.link} to={ROUTES.newEncounter}>
          <Button>+ New</Button>
        </Link>
      </div>
      <EncounterList title="Today" items={[]} />
      <EncounterList title="Previous encounters" items={["1"]} />
    </Layout>
  );
};

export default Encounters;
