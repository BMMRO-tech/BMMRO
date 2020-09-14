/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useContext } from "react";

import Synced from "./icons/Synced";
import Pending from "./icons/Pending";
import { FirebaseContext } from "../firebaseContext/firebaseContext";

const PendingIndicator = () => {
  const { hasPending } = useContext(FirebaseContext);

  return hasPending ? <Pending /> : <Synced />;
};

export default PendingIndicator;
