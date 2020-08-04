import React from "react";
import { waitFor, fireEvent } from "@testing-library/react/pure";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import Logout from "../Logout";

describe("Logout", () => {
  it("displays the user's email address", async () => {
    const { queryByTestId } = renderWithMockContexts(<Logout />, {
      loggedInUser: "some-user",
    });

    expect(queryByTestId("user-email")).toBeInTheDocument();
  });

  it("displays a confirmation modal when user presses the Logout button", async () => {
    const { queryByTestId } = renderWithMockContexts(<Logout />);

    fireEvent.click(queryByTestId("logout-button"));

    await waitFor(() =>
      expect(queryByTestId("confirmation-modal")).toBeInTheDocument()
    );
  });
});
