/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import BackLink from "../components/BackLink";
import {
  generateNewLogbookEntryURL,
  generateViewTripURL,
  ROUTES,
} from "../constants/routes";
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
import EndTripConfirmationModal from "../components/EndTripConfirmationModal";

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
  // const [enterEndDateManually, setEnterEndDateManually] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const confirmTripEnd = () => {
    setShowConfirmationModal(true);
  };

  const handleEndTrip = () => {
    const tripPath = generateTripPath(tripId);
    trip.hasEnded = true;

    // const sameDate = (date) => {
    //   const now = new Date();
    //
    //   return (
    //     date.getDate() === now.getDate() &&
    //     date.getMonth() === now.getMonth() &&
    //     date.getFullYear() === now.getFullYear()
    //   );
    // };
    // add the functionality where we can enter the data manually
    //     if (!sameDate(trip.date)) {
    // setEnterEndDateManually(true)
    // };
    datastore.updateDocByPath(tripPath, { hasEnded: trip.hasEnded });
    setShowConfirmationModal(false);
    setTrip(trip);
    console.log(trip);
    navigate(generateViewTripURL(tripId));
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
  }, [datastore, trip.id, trip.hasEnded]);

  const renderConfirmationModal = () => {
    return (
      <EndTripConfirmationModal
        tripId={tripId}
        closeModal={() => setShowConfirmationModal(false)}
        handleLeavePage={handleEndTrip}
      />
    );
  };

  const renderButtons = () => {
    if (trip.hasEnded || trip.exported) {
      return (
        <div css={utilities.backLinkContainer.bottom}>
          <BackLink text="Return to trip overview" to={ROUTES.trips} />
        </div>
      );
    }

    return (
      <div css={styles.footerContainer}>
        <Button testId={"saveEndTrip"} onClick={confirmTripEnd}>
          End trip
        </Button>
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
          <TripOverview trip={trip} tripId={tripId} />
          <div css={styles.list}>
            <SubCollectionList
              hasEnded={trip?.hasEnded}
              items={logbookEntries}
              parentId={tripId}
              isExported={trip?.exported}
              type="logbook"
              newUrl={generateNewLogbookEntryURL(tripId)}
            />
          </div>
          {renderButtons()}
          {showConfirmationModal && renderConfirmationModal()}
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
};
export default ViewTrip;
