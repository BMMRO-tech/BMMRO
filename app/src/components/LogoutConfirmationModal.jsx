/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState, Fragment, forwardRef, useRef } from "react";
import firebase from "firebase/app";
import {
  AlertDialogOverlay,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import "@reach/dialog/styles.css";
import { AuthenticationErrorType } from "../constants/authentication";
import colors from "../materials/colors";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import Attention from "./icons/Attention";

const LogoutConfirmationModal = ({ closeModal }) => {
  const [logoutError, setLogoutError] = useState(null);
  const cancelRef = useRef();

  const styles = {
    overlayBackground: css`
      background-color: rgba(0, 0, 0, 0.5);
    `,
    overlay: css`
      z-index: 9999;
    `,
    modal: css`
      position: fixed;
      background-color: white;
      display: block;
      padding: 20px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      @media (max-width: 800px) {
        min-width: 90%;
      }
    `,
    modalHeader: css`
      text-align: center;
      font-weight: bold;
    `,
    modalHeaderContainerOffline: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    attentionIcon: css`
      padding-right: 20px;
    `,
    modalText: css`
      padding: 20px 0 20px 0;
    `,
    modalButtons: css`
      text-align: center;
    `,
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .catch(() =>
        setLogoutError({ type: AuthenticationErrorType.UNSUCCESSFUL_LOGOUT })
      );
  };

  const renderOnlineModalTitle = () => {
    return (
      <AlertDialogLabel
        css={styles.modalHeader}
        data-testid="online-modal-title"
      >
        Logout?
      </AlertDialogLabel>
    );
  };

  const renderOfflineModalTitle = () => {
    return (
      <div css={styles.modalHeaderContainerOffline}>
        <div css={styles.attentionIcon}>
          <Attention />
        </div>
        <AlertDialogLabel
          css={styles.modalHeader}
          data-testid="offline-modal-title"
        >
          Logout while offline?
        </AlertDialogLabel>
      </div>
    );
  };

  const renderOnlineModalDescription = () => {
    return (
      <AlertDialogDescription css={styles.modalText}>
        If you lose internet connection you will not be able to log back in
        until you are online again.
      </AlertDialogDescription>
    );
  };

  const renderOfflineModalDescription = () => {
    return (
      <AlertDialogDescription css={styles.modalText}>
        <ul>
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
    <Button variant="secondary" ref={ref} onClick={closeModal}>
      Stay logged in
    </Button>
  ));

  return (
    <Fragment css={styles.overlayBackground}>
      <AlertDialogOverlay
        css={styles.overlay}
        leastDestructiveRef={cancelRef}
        data-testid="confirmation-modal"
      >
        <div css={styles.modal}>
          <div css={styles.modalHeader}>
            {navigator.onLine
              ? renderOnlineModalTitle()
              : renderOfflineModalTitle()}
          </div>
          {navigator.onLine
            ? renderOnlineModalDescription()
            : renderOfflineModalDescription()}
          <div css={styles.modalButtons}>
            <Button
              primaryBackgroundColor={
                navigator.onLine ? colors.darkBlue : colors.darkRed
              }
              testId="confirm-logout-button"
              onClick={logout}
            >
              Logout
            </Button>
            <CancelButton />
          </div>

          {!!logoutError && (
            <ErrorMessage error={logoutError} testId="logout-error" />
          )}
        </div>
      </AlertDialogOverlay>
    </Fragment>
  );
};

export default LogoutConfirmationModal;
