import { useEffect } from "react";
import { useLocation, useNavigate } from "@reach/router";

export const useLogoutRedirect = (loggedInUser) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login", { state: { from: location.pathname } });
    }
    // eslint-disable-next-line
  }, [loggedInUser]);
};
