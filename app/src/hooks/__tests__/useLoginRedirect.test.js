import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React, { useContext } from "react";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import { useLoginRedirect } from "../useLoginRedirect";

describe("useLoginRedirect", () => {
  const TestApp = () => {
    const { loggedInUser } = useContext(FirebaseContext);
    useLoginRedirect(loggedInUser);

    return <div />;
  };

  it("navigates to '/encounters' when user is logged in", async () => {
    const {
      history: { location },
    } = renderWithMockContexts(<TestApp />, {
      loggedInUser: "dummy user",
      route: "/initial-route",
    });

    expect(location.pathname).toEqual("/encounters");
  });

  it("has no effect when user is logged out", async () => {
    const {
      history: { location },
    } = renderWithMockContexts(<TestApp />, { route: "/initial-route" });

    expect(location.pathname).toEqual("/initial-route");
  });
});
