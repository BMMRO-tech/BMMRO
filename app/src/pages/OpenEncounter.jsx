/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState } from "react";
import { navigate } from "@reach/router";
import { fromUnixTime } from "date-fns";

import utilities from "../materials/utilities";
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
  const onEndEncounterClick = () => {
    clientPersistence.remove("openEncounterPath");
    clientPersistence.remove("openEncounterStartTimestamp");
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

      if (!encounterResult.data) {
        clientPersistence.remove("openEncounterPath");
        clientPersistence.remove("openEncounterStartTimestamp");
        navigate(ROUTES.newEncounter);
        return;
      }

      setEncounter({
        ...encounterResult.data,
        habitatUseEntries: habitatUseResult,
      });

      clientPersistence.set(
        "openEncounterStartTimestamp",
        fromUnixTime(encounterResult.data.startTimestamp.seconds)
      );
    };

    const openEncounterPath = clientPersistence.get("openEncounterPath");

    if (!openEncounterPath) {
      navigate(ROUTES.newEncounter);
      return;
    }

    if (!!datastore) {
      getData(openEncounterPath);
    }
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!!Object.keys(encounter).length ? (
        <div css={utilities.sticky.contentContainer}>
          <EncounterOverview encounter={encounter} />
          {!!encounter.habitatUseEntries && (
            <HabitatUseList items={encounter.habitatUseEntries} />
          )}
          <div css={utilities.sticky.footerContainer}>
            <Button onClick={onEndEncounterClick}>End encounter</Button>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
};

export default OpenEncounter;
