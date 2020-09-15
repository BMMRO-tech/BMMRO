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

const DateInvalidModal = ({ closeModal }) => {
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
    <Button variant="primary" ref={ref} onClick={closeModal}>
      Close
    </Button>
  ));

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
                Encounter End Date Invalid
              </AlertDialogLabel>
            </div>
          </div>
          <AlertDialogDescription
            css={utilities.confirmationModal.modalDescription}
          >
            Please set end date within 3 days of the start date.
          </AlertDialogDescription>
          <div css={utilities.confirmationModal.modalButtons}>
            <CancelButton />
          </div>
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default DateInvalidModal;
