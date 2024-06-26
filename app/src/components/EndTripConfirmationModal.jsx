/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext, useRef } from "react";
import { AlertDialogLabel, AlertDialogOverlay } from "@reach/alert-dialog";
import "@reach/dialog/styles.css";
import utilities from "../materials/utilities";
import { CollectionNames, generateTripPath } from "../constants/datastore";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import LastLogbookForm from "./LastLogbookForm";
import { getCurrentDate } from "../utils/time";
import { format } from "date-fns";
import { TIME_WITH_SECONDS_FORMAT } from "../constants/forms";

const EndTripConfirmationModal = ({
  closeModal,
  tripId,
  handleLeavePage,
  tripDate,
}) => {
  const cancelRef = useRef();
  const { datastore } = useContext(FirebaseContext);

  const handleSubmit = (values) => {
    const currentTime = format(getCurrentDate(), TIME_WITH_SECONDS_FORMAT);
    const tripPath = generateTripPath(tripId);
    const logbookValues = {
      time: values.time ? values.time : currentTime,
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
      logbookComments: values.logbookComments,
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
          <div css={utilities.sticky.contentContainer}>
            <LastLogbookForm
              handleSubmit={handleSubmit}
              closeModal={closeModal}
              tripDate={tripDate}
            />
          </div>
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default EndTripConfirmationModal;
