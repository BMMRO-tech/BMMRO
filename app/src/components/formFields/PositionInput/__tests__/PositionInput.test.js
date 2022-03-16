/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import PositionInput from "../PositionInput";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";

describe("PositionInput", () => {
  const refresh = jest.fn();

  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    const positionInput = getByRole("spinbutton", { name: "Your latitude" });
    await userEvent.type(positionInput, "10.123450", { delay: 1 });

    expect(getFormValues().lat).toEqual("10.123450");
  });

  it("does not display an error when field value is correct", async () => {
    const { getByRole, queryByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        isRequired
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    const positionInput = getByRole("spinbutton", {
      name: "Your latitude *",
    });
    await act(async () => {
      await userEvent.type(positionInput, "15.123456", { delay: 1 });
      userEvent.tab();
    });

    expect(
      queryByRole("alert", { name: "Your latitude" })
    ).not.toBeInTheDocument();
  });

  it("validates min value", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("spinbutton", { name: "Your latitude" });
      await userEvent.type(positionInput, "-100.123456", { delay: 1 });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(FormErrorType.MIN_VALUE, {
      value: -90,
    });
    expect(getFormErrors().lat).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "Your latitude" })).toHaveTextContent(
      expectedErrorMessage
    );
  });

  it("validates max value", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("spinbutton", { name: "Your latitude" });
      await userEvent.type(positionInput, "100.123456", { delay: 1 });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(FormErrorType.MAX_VALUE, {
      value: 90,
    });
    expect(getFormErrors().lat).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "Your latitude" })).toHaveTextContent(
      expectedErrorMessage
    );
  });

  it("displays error for less than 6 decimal places", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("spinbutton", { name: "Your latitude" });
      await userEvent.type(positionInput, "15.12345", { delay: 1 });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_DECIMAL_PLACES,
      { decimalPlaces: 6 }
    );
    expect(getFormErrors().lat).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "Your latitude" })).toHaveTextContent(
      expectedErrorMessage
    );
  });

  it("displays error for more than 6 decimal places", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("spinbutton", { name: "Your latitude" });
      await userEvent.type(positionInput, "15.1234567", { delay: 1 });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_DECIMAL_PLACES,
      { decimalPlaces: 6 }
    );
    expect(getFormErrors().lat).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "Your latitude" })).toHaveTextContent(
      expectedErrorMessage
    );
  });

  it("validates empty inputs if set as required", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        isRequired
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("spinbutton", {
        name: "Your latitude *",
      });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(FormErrorType.EMPTY);
    expect(getFormErrors().lat).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "Your latitude" })).toHaveTextContent(
      expectedErrorMessage
    );
  });

  it("autofills position if set as autofilled", async () => {
    const latitude = 1.123456;
    const longitude = 1.123456;

    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: {
            latitude,
            longitude,
          },
        })
      ),
    };
    global.navigator.geolocation = mockGeolocation;

    const { getFormValues } = renderWithinFormik(
      <PositionInput
        name="defaultLat"
        labelText="Default latitude"
        type="latitude"
        autofill
        isRefreshError={refresh}
      />,
      { defaultLat: "" }
    );

    await act(async () => {
      expect(getFormValues().defaultLat).toEqual("1.123456");
    });
  });

  it("does not allow input when field is disabled", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <PositionInput
        name="lat"
        labelText="Your latitude"
        type="latitude"
        autofill={false}
        isDisabled
        isRefreshError={refresh}
      />,
      { lat: "" }
    );

    const positionInput = getByRole("spinbutton", { name: "Your latitude" });
    await userEvent.type(positionInput, "10.123450", { delay: 1 });

    expect(getFormValues().lat).toEqual("");
  });
});
