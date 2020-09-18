import React from "react";
import userEvent from "@testing-library/user-event";

import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import DateInvalidModal from "../DateInvalidModal";

describe("Date Invalid Modal", () => {
  it("pressing close triggers close callback", () => {
    const mockCloseModal = jest.fn();
    const { getByRole } = renderWithMockContexts(
      <DateInvalidModal closeModal={mockCloseModal} />
    );

    const closeButton = getByRole("button", { name: "Close" });

    userEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
