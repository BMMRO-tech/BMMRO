import { useEffect } from "react";
import { useLocation, navigate } from "@reach/router";

export const useLogoutRedirect = (loggedInUser) => {
  const location = useLocation();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [loggedInUser]);
};
