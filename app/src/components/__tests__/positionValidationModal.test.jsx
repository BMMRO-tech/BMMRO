import React from "react";
import userEvent from "@testing-library/user-event";

import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import PositionalValidationModal from "../PositionalValidationModal";

describe("Positional Validation Modal", () => {
  it("navigates to '/encounters' when user selects end", async () => {
    const mockCloseModal = jest.fn();
    const mockHandleLeavePage = jest.fn();

    const { getByRole } = renderWithMockContexts(
      <PositionalValidationModal
        handleLeavePage={mockHandleLeavePage}
        closeModal={mockCloseModal}
        pageName="habitat"
      />
    );

    const closeButton = getByRole("button", { name: "End habitat" });

    userEvent.click(closeButton);

    expect(mockHandleLeavePage).toHaveBeenCalledTimes(1);
  });

  it("stays on the page", async () => {
    const mockCloseModal = jest.fn();
    const mockHandleLeavePage = jest.fn();

    const { getByRole } = renderWithMockContexts(
      <PositionalValidationModal
        handleLeavePage={mockHandleLeavePage}
        closeModal={mockCloseModal}
        pageName="habitat"
      />
    );

    const closeButton = getByRole("button", { name: "Stay on this page" });

    userEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
