/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { Fragment, useState, useContext } from "react";
import Button from "../components/Button";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const Logout = () => {
  const { loggedInUser } = useContext(FirebaseContext);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const styles = {
    text: css`
      padding-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
  };

  const renderConfirmationModal = () => {
    return (
      <LogoutConfirmationModal
        closeModal={() => setShowConfirmationModal(false)}
      />
    );
  };

  return (
    <Fragment>
      <div css={styles.text} data-testid="user-email">
        {loggedInUser?.email || "Loading user..."}
      </div>
      <Button
        width="100%"
        onClick={() => setShowConfirmationModal(true)}
        testId="logout-button"
      >
        Logout
      </Button>

      {showConfirmationModal && renderConfirmationModal()}
    </Fragment>
  );
};

export default Logout;
