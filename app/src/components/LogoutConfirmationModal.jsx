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
    modal: css`
      z-index: 999;
      position: fixed;
      background-color: white;
      box-shadow: 0.5px 1px 1.5px 2px rgba(40, 54, 104, 0.15);
      display: block;
      margin: auto;
      width: 50%;
      height: 50%;
      padding: 20px;

      @media (max-width: 800px) {
        width: 90%;
      }
    `,
    modalHeader: css`
      text-align: center;
      padding-bottom: 20px;
    `,
    modalHeaderText: css`
      font-weight: bold;
    `,
    modalText: css`
      padding-bottom: 20px;
    `,
    modalButtons: css`
      margin: auto;
      width: 50%;
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
      <Fragment>
        <Attention />
        <AlertDialogLabel
          css={styles.modalHeaderText}
          data-testid="offline-modal-title"
        >
          Logout while offline?
        </AlertDialogLabel>
      </Fragment>
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
    <AlertDialogOverlay
      css={styles.modal}
      leastDestructiveRef={cancelRef}
      data-testid="confirmation-modal"
    >
      <div css={styles.modalContent}>
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
      </div>

      {!!logoutError && (
        <ErrorMessage error={logoutError} testId="logout-error" />
      )}
    </AlertDialogOverlay>
  );
};

export default LogoutConfirmationModal;
