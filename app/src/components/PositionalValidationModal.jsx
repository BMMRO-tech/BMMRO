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

const PositionalValidationModal = ({ handleLeavePage, closeModal }) => {
  const cancelRef = useRef();

  const styles = {
    description: css`
      ${utilities.confirmationModal.modalDescription}
      text-align: center;
    `,
  };

  const StayButton = forwardRef((props, ref) => (
    <Button variant="neutral" ref={ref} onClick={closeModal}>
      Add positional data
    </Button>
  ));

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialogOverlay
        css={utilities.confirmationModal.overlay}
        leastDestructiveRef={cancelRef}
        data-testid="positional-data-modal"
      >
        <div css={utilities.confirmationModal.modal}>
          <AlertDialogLabel css={utilities.confirmationModal.modalHeader}>
            No positional data present!
          </AlertDialogLabel>
          <AlertDialogDescription css={styles.description}>
            Do you want to add positional data?
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

export default PositionalValidationModal;
