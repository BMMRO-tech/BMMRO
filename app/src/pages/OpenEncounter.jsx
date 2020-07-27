/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { navigate } from "@reach/router";

import { ROUTES } from "../constants/routes";
import clientPersistence from "../clientPersistence/clientPersistence";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterOverview from "../components/EncounterOverview";
import HabitatUseList from "../components/HabitatUseList";
import Button from "../components/Button";
import Loader from "../components/Loader";

const OpenEncounter = () => {
  const styles = {
    buttonContainer: css`
      display: flex;
      justify-content: center;
      margin-top: 20px;
    `,
  };

  const onEndEncounterClick = () => {
    clientPersistence.remove("openEncounterId");
    navigate(ROUTES.newEncounter);
  };

  const { datastore } = useContext(FirebaseContext);
  const [encounter, setEncounter] = useState({});

  useEffect(() => {
    const getData = async (encounterId) => {
      const [encounterResult, habitatUseResult] = await Promise.all([
        datastore.readEncounterById(encounterId),
        datastore.readHabitatUseByEncounterId(encounterId),
      ]);

      setEncounter({ ...encounterResult, habitatUseEntries: habitatUseResult });
    };

    const openEncounterId = clientPersistence.get("openEncounterId");

    if (!openEncounterId) {
      navigate(ROUTES.newEncounter);
    }

    if (!!datastore) {
      getData(openEncounterId);
    }
  }, [datastore]);

  return (
    <Layout>
      {!!Object.keys(encounter).length ? (
        <Fragment>
          <EncounterOverview content={encounter} />
          {!!encounter.habitatUseEntries && (
            <HabitatUseList items={encounter.habitatUseEntries} />
          )}
          <div css={styles.buttonContainer}>
            <Button onClick={onEndEncounterClick}>End Encounter</Button>
          </div>
        </Fragment>
      ) : (
        <Loader />
      )}
    </Layout>
  );
};

export default OpenEncounter;
