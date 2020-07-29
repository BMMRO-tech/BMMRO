/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { navigate } from "@reach/router";

import breakPoints from "../materials/breakPoints";
import { ROUTES } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
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
      margin-top: 10px;
      position: fixed;
      bottom: 0;
      background: white;
      width: 100%;
      padding: 10px;
      box-shadow: 0 -1px 5px 1px rgba(40, 54, 104, 0.15);

      @media (min-width: ${breakPoints.maxPhone}) {
        position: relative;
        bottom: auto;
        background: none;
        box-shadow: none;
      }
    `,
    listContainer: css`
      margin-bottom: 60px;

      @media (min-width: ${breakPoints.maxPhone}) {
        margin-bottom: 0;
      }
    `,
  };

  const onEndEncounterClick = () => {
    clientPersistence.remove("openEncounterPath");
    navigate(ROUTES.newEncounter);
  };

  const { datastore } = useContext(FirebaseContext);
  const [encounter, setEncounter] = useState({});

  useEffect(() => {
    const getData = async (encounterPath) => {
      const [encounterResult, habitatUseResult] = await Promise.all([
        datastore.readDocByPath(encounterPath),
        datastore.readDocsByParentPath(
          encounterPath,
          CollectionNames.HABITAT_USE
        ),
      ]);

      setEncounter({
        ...encounterResult.data,
        habitatUseEntries: habitatUseResult,
      });
    };

    const openEncounterPath = clientPersistence.get("openEncounterPath");

    if (!openEncounterPath) {
      navigate(ROUTES.newEncounter);
    }

    if (!!datastore) {
      getData(openEncounterPath);
    }
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!!Object.keys(encounter).length ? (
        <Fragment>
          <EncounterOverview content={encounter} />
          {!!encounter.habitatUseEntries && (
            <div css={styles.listContainer}>
              <HabitatUseList items={encounter.habitatUseEntries} />
            </div>
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
