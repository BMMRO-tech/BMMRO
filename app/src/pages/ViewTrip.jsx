/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import BackLink from "../components/BackLink";
import { ROUTES, generateNewLogbookEntryURL } from "../constants/routes";
import TripOverview from "../components/TripOverview";
import { CollectionNames, generateTripPath } from "../constants/datastore";
import { useNavigate } from "@reach/router";
import { useContext, useEffect, useState } from "react";
import typography from "../materials/typography";
import breakPoints from "../materials/breakPoints";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Button from "../components/Button";
import Loader from "../components/Loader";
import SubCollectionList from "../components/SubCollectionList";

const ViewTrip = ({ tripId }) => {
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
  const [trip, setTrip] = useState({});
  const [logbookEntries, setLogbookEntries] = useState([]);
  const navigate = useNavigate();

  const handleEndTrip = () => {
    // const tripPath = generateTripPath(tripId);

    // datastore.updateDocByPath(tripPath, {});
    navigate(ROUTES.trips);
  };

  useEffect(() => {
    const getData = async (tripPath) => {
      const [tripResult, logbookResult] = await Promise.all([
        datastore.readDocByPath(tripPath),
        datastore.readDocsByParentPath(tripPath, CollectionNames.LOGBOOK_ENTRY),
      ]);

      if (!tripResult.data) {
        navigate(ROUTES.trips);
        return;
      }

      setTrip(tripResult.data);
      setLogbookEntries(logbookResult);
    };

    if (!!datastore) {
      getData(generateTripPath(tripId));
    }
    // eslint-disable-next-line
  }, [datastore]);

  const renderButtons = () => {
    if (trip.hasEnded || trip.exported) {
      return (
        <div css={utilities.backLinkContainer.bottom}>
          <BackLink text="Return to trip list" to={ROUTES.encounters} />
        </div>
      );
    }

    return (
      <div css={styles.footerContainer}>
        <Button onClick={handleEndTrip}>End trip</Button>
      </div>
    );
  };

  return (
    <Layout hasDefaultPadding={false}>
      <div css={utilities.backLinkContainer.top}>
        <BackLink text="Return to trip overview" to={ROUTES.trips} />
      </div>

      {!!Object.keys(trip).length ? (
        <div css={utilities.sticky.contentContainer}>
          <TripOverview trip={trip} />
          <div css={styles.list}>
            <SubCollectionList
              items={logbookEntries}
              parentId={tripId}
              isExported={trip?.exported}
              type="logbook"
              newUrl={generateNewLogbookEntryURL(tripId)}
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
export default ViewTrip;
