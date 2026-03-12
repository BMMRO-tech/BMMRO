/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { useRef } from "react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";

import Button from "../components/Button";
import utilities from "../materials/utilities";

const PositionalValidationModal = ({
  handleLeavePage,
  closeModal,
  pageName,
}) => {
  const cancelRef = useRef();

  const styles = {
    description: css`
      ${utilities.confirmationModal.modalDescription}
      text-align: center;
    `,
  };

  const StayButton = (ref) => (
    <Button
      variant="neutral"
      ref={ref}
      onClick={closeModal}
      testId="add-data-button"
      isMedium={true}
    >
      Stay on this page
    </Button>
  );

  return (
    <div css={utilities.confirmationModal.overlayBackground}>
      <AlertDialog.Overlay
        css={utilities.confirmationModal.overlay}
        leastDestructiveRef={cancelRef}
        data-testid="positional-data-modal"
      >
        <div css={utilities.confirmationModal.modal}>
          <AlertDialog.Title css={utilities.confirmationModal.modalHeader}>
            No positional data present!
          </AlertDialog.Title>
          <AlertDialog.Description css={styles.description}>
            End {pageName} without positional data?
          </AlertDialog.Description>
          <div css={utilities.confirmationModal.modalButtons}>
            <Button
              variant="primary"
              onClick={handleLeavePage}
              isMedium={true}
              testId={"saveAnyway"}
            >
              End {pageName}
            </Button>
            <StayButton />
          </div>
        </div>
      </AlertDialog.Overlay>
    </div>
  );
};

export default PositionalValidationModal;
