import React from "react";
import { waitFor, fireEvent } from "@testing-library/react/pure";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import { buildFirebaseAuthMock } from "../../utils/test/firebase";
import LogoutConfirmationModal from "../LogoutConfirmationModal";

describe("Logout Confirmation Modal", () => {
  it("renders the correct modal title when user is online", () => {
    jest.spyOn(navigator, "onLine", "get").mockReturnValueOnce(true);

    const { queryByTestId } = renderWithMockContexts(
      <LogoutConfirmationModal />
    );

    expect(queryByTestId("online-modal-title")).toBeInTheDocument();
    expect(queryByTestId("offline-modal-title")).not.toBeInTheDocument();
  });

  it("renders the correct modal title when user is offline", () => {
    jest.spyOn(navigator, "onLine", "get").mockReturnValueOnce(false);

    const { queryByTestId } = renderWithMockContexts(
      <LogoutConfirmationModal />
    );

    expect(queryByTestId("offline-modal-title")).toBeInTheDocument();
    expect(queryByTestId("online-modal-title")).not.toBeInTheDocument();
  });

  it("displays an error when logout is unsuccessful", async () => {
    const signOutResult = {
      signOut: jest.fn().mockRejectedValue(new Error("some error")),
    };
    buildFirebaseAuthMock(signOutResult);
    const { queryByTestId } = renderWithMockContexts(
      <LogoutConfirmationModal />
    );
    fireEvent.click(queryByTestId("confirm-logout-button"));

    await waitFor(() =>
      expect(queryByTestId("logout-error")).toBeInTheDocument()
    );
  });
});
