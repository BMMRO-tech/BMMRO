import { render, waitFor } from "@testing-library/react/pure";
import React from "react";
import "@testing-library/jest-dom/extend-expect";

import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import Login from "../../pages/Login";

jest.mock("@reach/router", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("Login page", () => {
  it("should include the BMMRO logo", async () => {
    const { queryByTitle } = render(
      <FirebaseContext.Provider value={{ datastore: "some-datastore" }}>
        <Login />
      </FirebaseContext.Provider>
    );

    await waitFor(() => expect(queryByTitle("BMMRO Logo")).toBeInTheDocument());
  });
});
