import { useEffect } from "react";
import { useLocation, useNavigate } from "@reach/router";
import { ROUTES } from "../constants/routes";

export const useLoginRedirect = (loggedInUser) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      if (location.state && location.pathname !== location.state.from) {
        navigate(-1, { state: { from: location.pathname } });
      } else {
        navigate(ROUTES.trips, { state: { from: location.pathname } });
      }
    }
    // eslint-disable-next-line
  }, [loggedInUser]);
};
