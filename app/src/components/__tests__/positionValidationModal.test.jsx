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
      />
    );

    const closeButton = getByRole("button", { name: "End" });

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
      />
    );

    const closeButton = getByRole("button", { name: "Add positional data" });

    userEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});