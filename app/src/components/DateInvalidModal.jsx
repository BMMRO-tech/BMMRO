/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { forwardRef, useRef } from "react";
import {
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogOverlay,
} from "@reach/alert-dialog";

import utilities from "../materials/utilities";
import Attention from "./icons/Attention";
import colors from "../materials/colors";
import Button from "./Button";

const DateInvalidModal = ({ closeModal, navigateToEncounter }) => {
  const cancelRef = useRef();

  const styles = {
    attentionIcon: css`
      padding-right: 20px;
    `,
    error: css`
      color: ${colors.darkRed};
      font-size: 16px;
    `,
  };

  const CancelButton = forwardRef((_, ref) => (
    <Button variant="secondary" ref={ref} onClick={closeModal}>
      Close
    </Button>
  ));

  const modalText = !!navigateToEncounter
    ? "End date & time cannot be autofilled as it would make encounter longer than 72 hours. Please check start date & fill end date/time."
    : "End date and time cannot be more than 72 hours after start date and time.";

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialogOverlay
        css={utilities.confirmationModal.overlay}
        leastDestructiveRef={cancelRef}
        data-testid="confirmation-modal"
      >
        <div css={utilities.confirmationModal.modal}>
          <div css={utilities.confirmationModal.modalHeader}>
            <div css={utilities.confirmationModal.modalHeaderContainer}>
              <div css={styles.attentionIcon}>
                <Attention />
              </div>
              <AlertDialogLabel
                css={utilities.confirmationModal.modalHeader}
                data-testid="offline-modal-title"
              >
                Encounter is over 72 hours
              </AlertDialogLabel>
            </div>
          </div>
          <AlertDialogDescription
            css={utilities.confirmationModal.modalDescription}
          >
            {modalText}
          </AlertDialogDescription>
          <div css={utilities.confirmationModal.modalButtons}>
            <CancelButton />
            {!!navigateToEncounter && (
              <Button
                variant="primary"
                onClick={() => {
                  closeModal();
                  navigateToEncounter();
                }}
              >
                Go to encounter
              </Button>
            )}
          </div>
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default DateInvalidModal;
