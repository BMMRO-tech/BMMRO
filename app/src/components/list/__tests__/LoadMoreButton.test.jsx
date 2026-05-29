/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoadMoreButton from "../LoadMoreButton";

describe("LoadMoreButton", () => {
  it("is disabled if isLoading prop is true", async () => {
    const mockHandleClick = jest.fn();

    const { getByRole } = render(
      <LoadMoreButton
        text="load more"
        handleClick={mockHandleClick}
        isLoading
      />,
    );

    const loadMoreButton = getByRole("button");
    await userEvent.click(loadMoreButton);

    expect(loadMoreButton).toBeDisabled();
    expect(mockHandleClick).not.toHaveBeenCalled();
  });
});
