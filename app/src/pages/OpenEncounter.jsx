/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "@reach/router";

import utilities from "../materials/utilities";
import { ROUTES } from "../constants/routes";
import { CollectionNames, generateEncounterPath } from "../constants/datastore";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterOverview from "../components/EncounterOverview";
import HabitatUseList from "../components/HabitatUseList";
import Button from "../components/Button";
import Loader from "../components/Loader";

const OpenEncounter = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [encounter, setEncounter] = useState({});
  const navigate = useNavigate();

  const onEndEncounterClick = () => {
    navigate(ROUTES.newEncounter);
  };

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
        navigate(ROUTES.newEncounter);
        return;
      }

      setEncounter({
        ...encounterResult.data,
        habitatUseEntries: habitatUseResult,
      });
    };

    if (!!datastore) {
      getData(generateEncounterPath(encounterId));
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!!Object.keys(encounter).length ? (
        <div css={utilities.sticky.contentContainer}>
          <EncounterOverview encounter={encounter} />
          <HabitatUseList
            items={encounter.habitatUseEntries}
            encounterId={encounterId}
          />
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
