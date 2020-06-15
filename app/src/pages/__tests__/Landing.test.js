import React from "react";
import { act, render, cleanup } from "@testing-library/react/pure";
import firebase from "firebase";
import { FirebaseContext } from "../../firebaseContext/firebaseContext";
import Landing from "../Landing";

describe("Landing page", () => {
  beforeEach(() => {
    jest.spyOn(firebase, "auth").mockImplementation(() => {
      return {
        onAuthStateChanged: jest.fn(),
      };
    });

    jest.spyOn(firebase, "firestore").mockImplementation(() => {
      return {
        enablePersistence: jest.fn(),
      };
    });
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
});
