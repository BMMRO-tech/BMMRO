/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { useRef } from "react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
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

  const StayButton = () => (
    <Button variant="neutral" onClick={closeModal}>
      Stay on this page
    </Button>
  );

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialog.Overlay
        css={utilities.confirmationModal.overlay}
        leastDestructiveRef={cancelRef}
        data-testid="cancel-confirmation-modal"
      >
        <div css={utilities.confirmationModal.modal}>
          <AlertDialog.Title css={utilities.confirmationModal.modalHeader}>
            Leave without saving changes?
          </AlertDialog.Title>
          <AlertDialog.Description css={styles.description}>
            Any changes made to this form will be lost.
          </AlertDialog.Description>
          <div css={utilities.confirmationModal.modalButtons}>
            <Button variant="primary" onClick={handleLeavePage}>
              Leave
            </Button>
            <StayButton />
          </div>
        </div>
      </AlertDialog.Overlay>
    </div>
  );
};

export default CancelFormConfirmationModal;
