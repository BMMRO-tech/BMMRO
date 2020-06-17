import React from "react";
import { render, wait, fireEvent } from "@testing-library/react/pure";
import { buildFirebaseAuthMock } from "../../testUtils/firebase";
import Logout from "../Logout";

describe("Logout", () => {
  it("should display an error when logout is unsuccessful", async () => {
    const signOutResult = {
      signOut: jest.fn().mockRejectedValue(new Error("some error")),
    };
    buildFirebaseAuthMock(signOutResult);

    const { queryByTestId } = render(<Logout />);

    fireEvent.click(queryByTestId("logout-button"));

    await wait(() => expect(queryByTestId("logout-error")).toBeInTheDocument());
  });
});