import { useEffect } from "react";
import { useLocation, navigate } from "@reach/router";

export const useLoginRedirect = (loggedInUser) => {
  const location = useLocation();

  useEffect(() => {
    if (loggedInUser) {
      if (location.pathname !== location.state.from) {
        navigate(-1, { state: { from: location.pathname } });
      } else {
        navigate("/", { state: { from: location.pathname } });
      }
    }
  }, [loggedInUser]);
};
