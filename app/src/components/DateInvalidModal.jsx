/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { useRef } from "react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import utilities from "../materials/utilities";
import Attention from "./icons/Attention";
import colors from "../materials/colors";
import Button from "./Button";
import breakPoints from "../materials/breakPoints";

const DateInvalidModal = ({ closeModal, navigateToEncounter }) => {
  const cancelRef = useRef();

  const styles = {
    attentionIcon: css`
      @media (min-width: ${breakPoints.maxPhone}) {
        padding-right: 20px;
      }
    `,
    error: css`
      color: ${colors.darkRed};
      font-size: 16px;
    `,
  };

  const CancelButton = (ref) => (
    <Button variant="primary" ref={ref} onClick={closeModal}>
      Close
    </Button>
  );

  const modalText = !!navigateToEncounter
    ? "Encounter cannot be ended as end date and time is more than 72 hours after start date and time. Please update in the encounter data sheet."
    : "End date and time cannot be more than 72 hours after start date and time.";

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialog.Overlay
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
              <AlertDialog.Title
                css={utilities.confirmationModal.modalHeader}
                data-testid="offline-modal-title"
              >
                Encounter is over 72 hours
              </AlertDialog.Title>
            </div>
          </div>
          <AlertDialog.Description
            css={utilities.confirmationModal.modalDescription}
          >
            {modalText}
          </AlertDialog.Description>
          <div css={utilities.confirmationModal.modalButtons}>
            {!!navigateToEncounter ? (
              <Button
                variant="primary"
                onClick={() => {
                  closeModal();
                  navigateToEncounter();
                }}
              >
                Go to encounter data sheet
              </Button>
            ) : (
              <CancelButton />
            )}
          </div>
        </div>
      </AlertDialog.Overlay>
    </div>
  );
};

export default DateInvalidModal;
