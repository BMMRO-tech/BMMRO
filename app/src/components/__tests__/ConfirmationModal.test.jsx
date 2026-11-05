import React from "react";
import userEvent from "@testing-library/user-event";

import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import ConfirmationModal from "../ConfirmationModal";

describe("Confirmation Modal", () => {
  const renderModal = (props) =>
    renderWithMockContexts(
      <ConfirmationModal
        title="Some title"
        description="Some description"
        confirmLabel="Confirm"
        cancelLabel="Go back"
        {...props}
      />,
    );

  it("renders the title and description", () => {
    const { getByText } = renderModal();

    expect(getByText("Some title")).toBeInTheDocument();
    expect(getByText("Some description")).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    const { getByRole } = renderModal({ onConfirm });

    await userEvent.click(getByRole("button", { name: "Confirm" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const onCancel = vi.fn();
    const { getByRole } = renderModal({ onCancel });

    await userEvent.click(getByRole("button", { name: "Go back" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
