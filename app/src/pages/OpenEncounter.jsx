/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "@reach/router";

import utilities from "../materials/utilities";
import breakPoints from "../materials/breakPoints";
import { ROUTES } from "../constants/routes";
import { CollectionNames, generateEncounterPath } from "../constants/datastore";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterOverview from "../components/EncounterOverview";
import HabitatUseList from "../components/HabitatUseList";
import Button from "../components/Button";
import Loader from "../components/Loader";

const OpenEncounter = ({ encounterId }) => {
  const styles = {
    list: css`
      margin: 10px;

      @media (min-width: ${breakPoints.mediumTablet}) {
        margin: 0;
      }
    `,
  };

  const { datastore } = useContext(FirebaseContext);
  const [encounter, setEncounter] = useState({});
  const navigate = useNavigate();

  const onEndEncounterClick = () => {
    navigate(ROUTES.encounters);
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
        id: encounterId,
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
          <div css={styles.list}>
            <HabitatUseList
              items={encounter.habitatUseEntries}
              encounterId={encounterId}
            />
          </div>
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
