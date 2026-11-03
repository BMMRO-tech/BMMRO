/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useState } from "react";
import firebase from "firebase/compat/app";

import { AuthenticationErrorType } from "../constants/authentication";
import getErrorMessage from "../utils/getErrorMessage";
import colors from "../materials/colors";
import Attention from "./icons/Attention";
import ConfirmationModal from "./ConfirmationModal";
import utilities from "../materials/utilities";

const LogoutConfirmationModal = ({ closeModal }) => {
  const [logoutError, setLogoutError] = useState(null);

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
          getErrorMessage(AuthenticationErrorType.UNSUCCESSFUL_LOGOUT),
        ),
      );
  };

  const title = navigator.onLine ? (
    <span data-testid="online-modal-title">Logout?</span>
  ) : (
    <span css={utilities.confirmationModal.modalHeaderContainer}>
      <span css={styles.attentionIcon}>
        <Attention />
      </span>
      <span data-testid="offline-modal-title">Logout while offline?</span>
    </span>
  );

  const description = navigator.onLine ? (
    "If you lose internet connection you will not be able to log back in until you are online again."
  ) : (
    <ul css={utilities.confirmationModal.modalDescriptionList}>
      <li>
        You will not be able to login and use the app until you are back online.
      </li>
      <li>
        Data saved offline will not be uploaded to the database until you log in
        again.
      </li>
    </ul>
  );

  return (
    <ConfirmationModal
      title={title}
      description={description}
      confirmLabel="Logout"
      cancelLabel="Stay logged in"
      variant={navigator.onLine ? "primary" : "warning"}
      onConfirm={logout}
      onCancel={closeModal}
      confirmTestId="confirm-logout-button"
      centerDescription={false}
    >
      {!!logoutError && (
        <div css={styles.error} data-testid="logout-error">
          {logoutError}
        </div>
      )}
    </ConfirmationModal>
  );
};

export default LogoutConfirmationModal;
