/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { useContext } from "react";

import Synced from "./icons/Synced";
import Pending from "./icons/Pending";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Tooltip from "./Tooltip";

const PendingIndicator = () => {
  const { pendingCount } = useContext(FirebaseContext);

  return pendingCount !== 0 ? (
    <Tooltip text={`${pendingCount} records pending upload`}>
      <Pending />
    </Tooltip>
  ) : (
    <Tooltip text="All records uploaded">
      <Synced />
    </Tooltip>
  );
};

export default PendingIndicator;
