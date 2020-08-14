/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { Link } from "@reach/router";
import { useContext } from "react";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import colors from "../materials/colors";
import Layout from "../components/Layout";
import EncounterList from "../components/EncounterList";
import Button from "../components/Button";
import { ROUTES } from "../constants/routes";
import useEncountersByMonth from "../hooks/useEncountersByMonth";

const Encounters = () => {
  const styles = {
    titleContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    `,
    link: css`
      text-decoration: none;
      margin-left: auto;
      min-height: 44px;
    `,
    titleText: css`
      margin: 0;
      color: ${colors.darkGray};
      font-size: 22px;
      font-weight: 600;
      text-transform: uppercase;
    `,
  };

  const { datastore } = useContext(FirebaseContext);
  const [
    todaysEncounters,
    previousEncounters,
    loadNextMonth,
  ] = useEncountersByMonth(datastore);

  return (
    <Layout hasDefaultPadding={false}>
      <div css={styles.titleContainer}>
        <h1 css={styles.titleText}>ENCOUNTERS</h1>
        <Link css={styles.link} to={ROUTES.newEncounter}>
          <Button>+ New</Button>
        </Link>
      </div>
      <EncounterList title="Today" items={todaysEncounters} />
      <EncounterList
        title="Previous encounters"
        items={previousEncounters}
        loadMore={loadNextMonth}
      />
    </Layout>
  );
};

export default Encounters;
