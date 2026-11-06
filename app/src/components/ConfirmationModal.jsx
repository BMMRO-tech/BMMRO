/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useRef } from "react";
import {
  AlertDialogOverlay,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import "@reach/dialog/styles.css";

import Button from "./Button";
import utilities from "../materials/utilities";

const ConfirmationModal = ({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "primary",
  onConfirm,
  onCancel,
  testId = "confirmation-modal",
  confirmTestId,
  cancelTestId,
  centerDescription = true,
  isMedium,
  children,
}) => {
  const cancelRef = useRef();

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialogOverlay
        css={utilities.confirmationModal.overlay}
        leastDestructiveRef={cancelRef}
        data-testid={testId}
      >
        <div css={utilities.confirmationModal.modal}>
          <AlertDialogLabel css={utilities.confirmationModal.modalHeader}>
            {title}
          </AlertDialogLabel>
          <AlertDialogDescription
            css={
              centerDescription
                ? utilities.confirmationModal.modalDescriptionCentered
                : utilities.confirmationModal.modalDescription
            }
          >
            {description}
          </AlertDialogDescription>
          <div css={utilities.confirmationModal.modalButtons}>
            <Button
              variant={variant}
              onClick={onConfirm}
              testId={confirmTestId}
              isMedium={isMedium}
            >
              {confirmLabel}
            </Button>
            <Button
              ref={cancelRef}
              variant="neutral"
              onClick={onCancel}
              testId={cancelTestId}
              isMedium={isMedium}
            >
              {cancelLabel}
            </Button>
          </div>
          {children}
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default ConfirmationModal;
