import { useEffect } from "react";
import { useLocation, useNavigate } from "@reach/router";
import { ROUTES } from "../constants/routes";
import clientPersistence from "../clientPersistence/clientPersistence";

export const useLogoutRedirect = (loggedInUser) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser && !clientPersistence.get("isLoggedIn")) {
      navigate(ROUTES.login, { state: { from: location.pathname } });
    }
    // eslint-disable-next-line
  }, [loggedInUser]);
};
