import { useEffect } from "react";
import { useLocation, useNavigate } from "@reach/router";
import clientPersistence from "../clientPersistence/clientPersistence";

export const useLogoutRedirect = (loggedInUser) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser && !clientPersistence.get("isLoggedIn")) {
      navigate("/login", { state: { from: location.pathname } });
    }
    // eslint-disable-next-line
  }, [loggedInUser]);
};
