import React from "react";
import { wait, fireEvent } from "@testing-library/react/pure";
import { renderWithMockContexts } from "../../testUtils/renderWithMockContexts";
import { buildFirebaseAuthMock } from "../../testUtils/firebase";
import Logout from "../Logout";

describe("Logout", () => {
  it("should display the user's email address", async () => {
    const { queryByTestId } = renderWithMockContexts(<Logout />, {
      loggedInUser: "some-user",
    });

    expect(queryByTestId("user-email")).toBeInTheDocument();
  });

  it("should display an error when logout is unsuccessful", async () => {
    const signOutResult = {
      signOut: jest.fn().mockRejectedValue(new Error("some error")),
    };
    buildFirebaseAuthMock(signOutResult);

    const { queryByTestId } = renderWithMockContexts(<Logout />);

    fireEvent.click(queryByTestId("logout-button"));

    await wait(() => expect(queryByTestId("logout-error")).toBeInTheDocument());
  });
});
