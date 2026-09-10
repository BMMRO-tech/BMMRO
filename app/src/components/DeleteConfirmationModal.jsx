/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { forwardRef, useRef } from "react";
import { AlertDialogOverlay, AlertDialogLabel, AlertDialogDescription } from "@reach/alert-dialog";
import "@reach/dialog/styles.css";
import Button from "./Button";
import utilities from "../materials/utilities";

const DeleteConfirmationModal = ({ entryLabel, onConfirm, onCancel }) => {
  const cancelRef = useRef();

  const CancelButton = forwardRef((props, ref) => (
    <Button
      variant="neutral"
      ref={ref}
      onClick={onCancel}
      testId="cancel-delete-button"
    >
      Cancel
    </Button>
  ));

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialogOverlay
        css={utilities.confirmationModal.overlay}
        leastDestructiveRef={cancelRef}
        data-testid="delete-confirmation-modal"
      >
        <div css={utilities.confirmationModal.modal}>
          <AlertDialogLabel css={utilities.confirmationModal.modalHeader}>
            Delete this {entryLabel}?
          </AlertDialogLabel>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
          <div css={utilities.confirmationModal.modalButtons}>
            <Button
              variant="warning"
              onClick={onConfirm}
              testId="confirm-delete-button"
            >
              Delete
            </Button>
            <CancelButton ref={cancelRef} />
          </div>
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default DeleteConfirmationModal;
