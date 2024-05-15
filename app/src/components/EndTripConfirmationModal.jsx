/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { forwardRef, useRef } from "react";
import {
  AlertDialogOverlay,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import "@reach/dialog/styles.css";

import Button from "../components/Button";
import utilities from "../materials/utilities";

const EndTripConfirmationModal = ({ handleLeavePage, closeModal }) => {
  const cancelRef = useRef();

  const styles = {
    description: css`
      ${utilities.confirmationModal.modalDescription}
      text-align: center;
    `,
  };

  const StayButton = forwardRef((props, ref) => (
    <Button variant="neutral" ref={ref} onClick={closeModal}>
      Stay on this page
    </Button>
  ));

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
            You won't be able to change this trip anymore.
          </AlertDialogDescription>
          <div css={utilities.confirmationModal.modalButtons}>
            <Button
              data-testid="confirm-end-button"
              variant="primary"
              onClick={handleLeavePage}
            >
              Save & Continue
            </Button>
            <StayButton />
          </div>
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default EndTripConfirmationModal;
