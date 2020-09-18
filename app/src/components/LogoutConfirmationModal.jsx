/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState, forwardRef, useRef } from "react";
import firebase from "firebase/app";
import {
  AlertDialogOverlay,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import "@reach/dialog/styles.css";

import { AuthenticationErrorType } from "../constants/authentication";
import getErrorMessage from "../utils/getErrorMessage";
import colors from "../materials/colors";
import Button from "../components/Button";
import Attention from "./icons/Attention";
import utilities from "../materials/utilities";

const LogoutConfirmationModal = ({ closeModal }) => {
  const [logoutError, setLogoutError] = useState(null);
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

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .catch(() =>
        setLogoutError(
          getErrorMessage(AuthenticationErrorType.UNSUCCESSFUL_LOGOUT)
        )
      );
  };

  const renderOnlineModalTitle = () => {
    return (
      <AlertDialogLabel
        css={utilities.confirmationModal.modalHeader}
        data-testid="online-modal-title"
      >
        Logout?
      </AlertDialogLabel>
    );
  };

  const renderOfflineModalTitle = () => {
    return (
      <div css={utilities.confirmationModal.modalHeaderContainer}>
        <div css={styles.attentionIcon}>
          <Attention />
        </div>
        <AlertDialogLabel
          css={utilities.confirmationModal.modalHeader}
          data-testid="offline-modal-title"
        >
          Logout while offline?
        </AlertDialogLabel>
      </div>
    );
  };

  const renderOnlineModalDescription = () => {
    return (
      <AlertDialogDescription
        css={utilities.confirmationModal.modalDescription}
      >
        If you lose internet connection you will not be able to log back in
        until you are online again.
      </AlertDialogDescription>
    );
  };

  const renderOfflineModalDescription = () => {
    return (
      <AlertDialogDescription
        css={utilities.confirmationModal.modalDescription}
      >
        <ul css={utilities.confirmationModal.modalDescriptionList}>
          <li>
            You will not be able to login and use the app until you are back
            online.
          </li>
          <li>
            Data saved offline will not be uploaded to the database until you
            log in again.
          </li>
        </ul>
      </AlertDialogDescription>
    );
  };

  const CancelButton = forwardRef((props, ref) => (
    <Button variant="neutral" ref={ref} onClick={closeModal}>
      Stay logged in
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
            {navigator.onLine
              ? renderOnlineModalTitle()
              : renderOfflineModalTitle()}
          </div>
          {navigator.onLine
            ? renderOnlineModalDescription()
            : renderOfflineModalDescription()}
          <div css={utilities.confirmationModal.modalButtons}>
            <Button
              variant={navigator.onLine ? "primary" : "warning"}
              testId="confirm-logout-button"
              onClick={logout}
            >
              Logout
            </Button>
            <CancelButton />
          </div>

          {!!logoutError && (
            <div css={styles.error} data-testid="logout-error">
              {logoutError}
            </div>
          )}
        </div>
      </AlertDialogOverlay>
    </div>
  );
};

export default LogoutConfirmationModal;
