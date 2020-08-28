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

const CancelFormConfirmationModal = ({ handleLeavePage, closeModal }) => {
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
        data-testid="cancel-confirmation-modal"
      >
        <div css={utilities.confirmationModal.modal}>
          <AlertDialogLabel css={utilities.confirmationModal.modalHeader}>
            Leave without saving changes?
          </AlertDialogLabel>
          <AlertDialogDescription css={styles.description}>
            Any changes made to this form will be lost.
          </AlertDialogDescription>
          <div css={utilities.confirmationModal.modalButtons}>
            <Button variant="primary" onClick={handleLeavePage}>
              Leave
            </Button>
            <StayButton />
          </div>
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default CancelFormConfirmationModal;
