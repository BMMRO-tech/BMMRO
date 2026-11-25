/** @jsxRuntime classic */
/** @jsx jsx */

import { css, jsx } from "@emotion/react";
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
import ConfirmationModal from "../components/ConfirmationModal";

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
    deleteButtonContainer: css`
      display: flex;
      justify-content: flex-end;
      padding: 10px;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await datastore.softDeleteDocWithSubcollections(
        generateTripPath(tripId),
        [CollectionNames.LOGBOOK_ENTRY],
      );
      navigate(ROUTES.trips);
    } catch (_) {
      setShowDeleteModal(false);
    }
  };

  const confirmTripEnd = () => {
    setShowConfirmationModal(true);
  };

  const handleEndTrip = () => {
    const tripPath = generateTripPath(tripId);
    trip.hasEnded = true;

    datastore.updateDocByPath(tripPath, { hasEnded: trip.hasEnded });
    setShowConfirmationModal(false);
    setTrip(trip);
    navigate(generateViewTripURL(tripId));
  };

  useEffect(() => {
    const getData = async (tripPath) => {
      const [tripResult, logbookResult] = await Promise.all([
        datastore.readDocByPath(tripPath),
        datastore.readDocsByParentPath(tripPath, CollectionNames.LOGBOOK_ENTRY),
      ]);

      if (!tripResult.data || tripResult.data.deleted === true) {
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
        tripDate={trip.date}
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
      {!!Object.keys(trip).length ? (
        <div css={utilities.sticky.contentContainer}>
          <div css={styles.deleteButtonContainer}>
            <Button
              type="button"
              variant="warning"
              onClick={() => setShowDeleteModal(true)}
              testId="delete-entry-button"
            >
              Delete trip
            </Button>
          </div>
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
          {showDeleteModal && (
            <ConfirmationModal
              title="Delete this trip?"
              description="This trip and all of its logbook entries will be removed."
              confirmLabel="Delete"
              variant="warning"
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteModal(false)}
              testId="delete-confirmation-modal"
              confirmTestId="confirm-delete-button"
              cancelTestId="cancel-delete-button"
            />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
};
export default ViewTrip;
