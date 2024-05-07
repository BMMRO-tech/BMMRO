/** @jsx jsx */
import {css, jsx} from "@emotion/core";
import {useContext} from "react";

import {FirebaseContext} from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterList from "../components/EncounterList";
import {useEncountersByMonth} from "../hooks/useEncountersByMonth";
import utilities from "../materials/utilities";

const Encounters = () => {
  const styles = {
    titleContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    `,
    list: css`
      margin: 10px 10px 30px 10px;
    `,
  };

  const { datastore } = useContext(FirebaseContext);
  const { todaysEncounters, previousEncounters } =
    useEncountersByMonth(datastore);

  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>Encounters</h1>
      <div css={styles.list}>
        <EncounterList title="Today" encounters={todaysEncounters} isToday />
      </div>
      <div css={styles.list}>
        <EncounterList
          title="Previous encounters"
          encounters={previousEncounters}
        />
      </div>
    </Layout>
  );
};

export default Encounters;
