import React from "react";
import { render, cleanup } from "@testing-library/react/pure";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import Landing from "../Landing";
import { buildFirestoreMock } from "../../testUtils/firebase";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
  Link: jest.fn().mockImplementation(() => {
    return <span>Link</span>;
  }),
}));

describe("Landing page", () => {
  beforeEach(() => {
    buildFirestoreMock();
  });

  afterEach(cleanup);

  it("should not display welcome text when context does not contain loggedInUser", () => {
    const { queryByTestId } = render(
      <FirebaseContext.Provider value={{ datastore: "some-datastore" }}>
        <Landing />
      </FirebaseContext.Provider>
    );

    const welcomeText = queryByTestId("welcome-text");
    expect(welcomeText).not.toBeInTheDocument();
  });

  it("should display welcome text when context contains loggedInUser", () => {
    const { queryByTestId } = render(
      <FirebaseContext.Provider
        value={{
          datastore: "some-datastore",
          loggedInUser: { email: "some-user" },
        }}
      >
        <Landing />
      </FirebaseContext.Provider>
    );

    const welcomeText = queryByTestId("welcome-text");
    expect(welcomeText).toBeInTheDocument();
  });
});
