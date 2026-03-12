import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import Login from "../../pages/Login";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,
    useLocation: () => ({ pathname: "/login" }),
    useNavigate: jest.fn(),
  };
});

const renderWithRouter = (ui) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Login page", () => {
  it("should include the BMMRO logo", async () => {
    const { queryByTitle } = renderWithRouter(
      <FirebaseContext.Provider
        value={{ datastore: "some-datastore", route: "/login" }}
      >
        <Login />
      </FirebaseContext.Provider>
    );

    await waitFor(() =>
      expect(queryByTitle("BMMRO Logo")).toBeInTheDocument()
    );
  });

  it("should not include tabs", async () => {
    renderWithRouter(
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