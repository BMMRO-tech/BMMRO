/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useContext, useRef } from "react";
import {
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from "@reach/alert-dialog";
import "@reach/dialog/styles.css";
import utilities from "../materials/utilities";
import { CollectionNames, generateTripPath } from "../constants/datastore";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import LastLogbookForm from "./LastLogbookForm";
import { getCurrentDate } from "../utils/time";
import { format } from "date-fns";
import { TIME_WITH_SECONDS_FORMAT } from "../constants/forms";

const EndTripConfirmationModal = ({ closeModal, tripId, handleLeavePage }) => {
  const cancelRef = useRef();
  const { datastore } = useContext(FirebaseContext);

  const handleSubmit = (values) => {
    const currentTime = format(getCurrentDate(), TIME_WITH_SECONDS_FORMAT);
    const tripPath = generateTripPath(tripId);
    const logbookValues = {
      time: values.time ? values.time + ":00" : currentTime,
      latitude: "",
      longitude: "",
      gpsMark: "",
      waterDepth: "",
      waterDepthBeyondSoundings: false,
      waterTemp: "",
      bottomSubstrate: "",
      cloudCover: "",
      beaufortSeaState: "",
      waveHeight: "",
      hydrophoneChecked: "No",
      efforted: "On",
      hydrophoneComments: "",
      logbookComments: values.tripMiles
        ? "trip miles: " + values.tripMiles
        : "",
      exported: false,
      hasEnded: true,
    };
    datastore.createSubDoc(
      tripPath,
      CollectionNames.LOGBOOK_ENTRY,
      logbookValues
    );
    handleLeavePage();
  };
  const styles = {
    description: css`
      ${utilities.confirmationModal.modalDescription}
      text-align: center;
    `,
  };

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialogOverlay
        css={utilities.confirmationModal.overlay}
        leastDestructiveRef={cancelRef}
        data-testid="end-trip-confirmation-modal"
      >
        <div css={utilities.confirmationModal.modal}>
          <AlertDialogLabel css={utilities.confirmationModal.modalHeader}>
            Are you sure you want to end this trip?
          </AlertDialogLabel>
          <AlertDialogDescription css={styles.description}>
            <p>If you leave the time field blank, the end</p>
            <p>time will be set to the current time.</p>
          </AlertDialogDescription>
          <div css={utilities.sticky.contentContainer}>
            <LastLogbookForm
              handleSubmit={handleSubmit}
              closeModal={closeModal}
            />
          </div>
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default EndTripConfirmationModal;
