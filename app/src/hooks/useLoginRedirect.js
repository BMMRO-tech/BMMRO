import { useEffect } from "react";
import { useLocation, useNavigate } from "@reach/router";

export const useLoginRedirect = (loggedInUser) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      if (location.state && location.pathname !== location.state.from) {
        navigate(-1, { state: { from: location.pathname } });
      } else {
        navigate("/", { state: { from: location.pathname } });
      }
    }
    // eslint-disable-next-line
  }, [loggedInUser]);
};
