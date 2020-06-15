import React from "react";
import { act, render, cleanup, wait } from "@testing-library/react/pure";
import user from "@testing-library/user-event";
import firebase from "firebase";
import { navigate } from "@reach/router";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import Landing from "../Landing";
import {
  buildFirebaseAuthMock,
  buildFirestoreMock,
} from "../../testUtils/firebase";

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

  it("should not display welcome text when context does not contain loggedInUser", async () => {
    let landingPage;
    await act(
      async () =>
        (landingPage = render(
          <FirebaseContext.Provider value={{ datastore: "some-datastore" }}>
            <Landing />
          </FirebaseContext.Provider>
        ))
    );

    const welcomeText = landingPage.queryByTestId("welcome-text");
    expect(welcomeText).not.toBeInTheDocument();
  });

  it("should display welcome text when context contains loggedInUser", async () => {
    let landingPage;
    await act(
      async () =>
        (landingPage = render(
          <FirebaseContext.Provider
            value={{
              datastore: "some-datastore",
              loggedInUser: { email: "some-user" },
            }}
          >
            <Landing />
          </FirebaseContext.Provider>
        ))
    );

    const welcomeText = landingPage.queryByTestId("welcome-text");
    expect(welcomeText).toBeInTheDocument();
  });

  it("should navigate to the login page on successful logout", async () => {
    const signOutResult = {
      signOut: jest.fn().mockResolvedValue("result of signOut"),
    };
    buildFirebaseAuthMock(signOutResult);

    let landingPage;
    await act(
      async () =>
        (landingPage = render(
          <FirebaseContext.Provider
            value={{
              datastore: "some-datastore",
              loggedInUser: { email: "some-user" },
            }}
          >
            <Landing />
          </FirebaseContext.Provider>
        ))
    );

    user.click(landingPage.queryByTestId("logout-button"));

    await wait(() => {
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  it("should display an error when logout is unsuccessful", async () => {
    const signOutResult = {
      signOut: jest.fn().mockRejectedValue(new Error("some error")),
    };
    buildFirebaseAuthMock(signOutResult);

    let landingPage;
    await act(
      async () =>
        (landingPage = render(
          <FirebaseContext.Provider
            value={{
              datastore: "some-datastore",
              loggedInUser: { email: "some-user" },
            }}
          >
            <Landing />
          </FirebaseContext.Provider>
        ))
    );

    user.click(landingPage.queryByTestId("logout-button"));

    await wait(() =>
      expect(landingPage.queryByTestId("logout-error")).toBeInTheDocument()
    );
  });
});
