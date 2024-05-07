import {render, waitFor} from "@testing-library/react/pure";
import React from "react";

import {FirebaseContext} from "../../firebaseContext/firebaseContext";
import Login from "../../pages/Login";
import {screen} from "@testing-library/react";

jest.mock("@reach/router", () => ({
  useLocation: () => ({ pathname: "/login" }),
  useNavigate: jest.fn(),
}));

describe("Login page", () => {
  it("should include the BMMRO logo", async () => {
    const { queryByTitle } = render(
      <FirebaseContext.Provider
        value={{ datastore: "some-datastore", route: "/login" }}
      >
        <Login />
      </FirebaseContext.Provider>
    );

    await waitFor(() => expect(queryByTitle("BMMRO Logo")).toBeInTheDocument());
  });

  it("should not include tabs", async () => {
    render(
      <FirebaseContext.Provider
        value={{ datastore: "some-datastore", route: "/login" }}
      >
        <Login />
      </FirebaseContext.Provider>
    );

    await waitFor(() =>
      expect(
        screen.queryByText("ENCOUNTERS", { selector: "button" })
      ).not.toBeInTheDocument()
    );
  });
});
