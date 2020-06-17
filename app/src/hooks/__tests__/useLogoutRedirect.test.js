import { renderWithMockContexts } from "../../testUtils/renderWithMockContexts";
import React, { useContext } from "react";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import { useLogoutRedirect } from "../useLogoutRedirect";

describe("useLogoutRedirect", () => {
  const TestApp = () => {
    const { loggedInUser } = useContext(FirebaseContext);
    useLogoutRedirect(loggedInUser);

    return <div />;
  };

  it("navigates to /login when user is not logged in", () => {
    const {
      history: { location },
    } = renderWithMockContexts(<TestApp />, {
      route: "/initial-path",
      loggedInUser: undefined,
    });

    expect(location.pathname).toEqual("/login");
  });

  it("stays on requested path when user is logged in", () => {
    const {
      history: { location },
    } = renderWithMockContexts(<TestApp />, {
      loggedInUser: "dummy user",
      route: "/initial-path",
    });

    expect(location.pathname).toEqual("/initial-path");
  });
});
