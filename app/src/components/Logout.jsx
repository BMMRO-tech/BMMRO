/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { useState, useContext } from "react";
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
    <div>
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
    </div>
  );
};

export default Logout;
