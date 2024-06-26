/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "@reach/router";
import add from "date-fns/add";

import utilities from "../materials/utilities";
import breakPoints from "../materials/breakPoints";
import {
  generateEditEncounterURL,
  generateNewBiopsyURL,
  generateNewHabitatUseURL,
  ROUTES,
} from "../constants/routes";
import { CollectionNames, generateEncounterPath } from "../constants/datastore";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterOverview from "../components/EncounterOverview";
import SubCollectionList from "../components/SubCollectionList";
import Button from "../components/Button";
import Loader from "../components/Loader";
import typography from "../materials/typography";
import BackLink from "../components/BackLink";
import endEntry from "../utils/endEntry";
import { constructDateTime } from "../utils/time";
import { THREE_DAYS_IN_HOURS } from "../constants/forms";
import DateInvalidModal from "../components/DateInvalidModal";

const OpenEncounter = ({ encounterId }) => {
  const styles = {
    footerContainer: css`
      ${utilities.sticky.footerContainer}
      flex-direction: column;
      align-items: center;
    `,
    list: css`
      margin: 10px;

      @media (min-width: ${breakPoints.mediumTablet}) {
        margin: 0;
      }
    `,
    disabledButtonMessage: css`
      ${typography.smallText}
      font-style: italic;
      margin-top: 10px;
      text-align: center;
      max-width: 300px;
    `,
  };

  const { datastore } = useContext(FirebaseContext);
  const [encounter, setEncounter] = useState({});
  const [habitatUseEntries, setHabitatUseEntries] = useState([]);
  const [biopsyEntries, setBiopsyEntries] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const navigate = useNavigate();

  const handleEndEncounter = () => {
    const encounterPath = generateEncounterPath(encounterId);

    const endedEncounter = endEntry(encounter);
    const endDateTime = constructDateTime(
      endedEncounter.endTimestamp,
      endedEncounter.endTime
    );

    const endDateLimit = add(new Date(endedEncounter.startTimestamp), {
      hours: THREE_DAYS_IN_HOURS,
    });

    if (endDateTime > endDateLimit) {
      setShowDateModal(true);
      return;
    }

    datastore.updateDocByPath(encounterPath, endedEncounter);
    navigate(ROUTES.encounters);
  };

  const isNewEncounter = () =>
    !encounter.sequenceNumber || !encounter.species || !encounter.area;

  useEffect(() => {
    const getData = async (encounterPath) => {
      const [encounterResult, habitatUseResult, biopsyResult] =
        await Promise.all([
          datastore.readDocByPath(encounterPath),
          datastore.readDocsByParentPath(
            encounterPath,
            CollectionNames.HABITAT_USE
          ),
          datastore.readDocsByParentPath(encounterPath, CollectionNames.BIOPSY),
        ]);

      if (!encounterResult.data) {
        navigate(ROUTES.newEncounter);
        return;
      }

      setEncounter(encounterResult.data);
      setHabitatUseEntries(habitatUseResult);
      setBiopsyEntries(biopsyResult);
    };

    if (!!datastore) {
      getData(generateEncounterPath(encounterId));
    }
    // eslint-disable-next-line
  }, [datastore]);

  const renderButtons = () => {
    if (encounter.hasEnded || encounter.exported) {
      return (
        <div css={utilities.backLinkContainer.bottom}>
          <BackLink text="Return to encounter list" to={ROUTES.encounters} />
        </div>
      );
    }

    return (
      <div css={styles.footerContainer}>
        <Button disabled={isNewEncounter()} onClick={handleEndEncounter}>
          End encounter
        </Button>
        {isNewEncounter() && (
          <div css={styles.disabledButtonMessage}>
            Please complete all required fields in encounter data sheet before
            ending the encounter
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout hasDefaultPadding={false}>
      {showDateModal && (
        <DateInvalidModal
          closeModal={() => setShowDateModal(false)}
          navigateToEncounter={() => {
            navigate(`${generateEditEncounterURL(encounterId)}#dates`);
          }}
        />
      )}
      {!!Object.keys(encounter).length ? (
        <div css={utilities.sticky.contentContainer}>
          <EncounterOverview
            isNewEncounter={isNewEncounter()}
            encounter={encounter}
            encounterId={encounterId}
          />
          <div css={styles.list}>
            <SubCollectionList
              items={habitatUseEntries}
              parentId={encounterId}
              isExported={encounter.exported}
              type="habitat"
              newUrl={generateNewHabitatUseURL(encounterId)}
            />
            <SubCollectionList
              items={biopsyEntries}
              parentId={encounterId}
              isExported={encounter.exported}
              newUrl={generateNewBiopsyURL(encounterId)}
            />
          </div>
          {renderButtons()}
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
};

export default OpenEncounter;
