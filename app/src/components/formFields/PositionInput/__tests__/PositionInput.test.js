/** @jsx jsx */
import { jsx } from "@emotion/core";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithinFormik from "../../../../utils/test/renderWithinFormik";
import PositionInput from "../PositionInput";
import { FormErrorType } from "../../../../constants/forms";
import getErrorMessage from "../../../../utils/getErrorMessage";

describe("PositionInput", () => {
  it("synchronizes field value with form state", async () => {
    const { getFormValues, getByRole } = renderWithinFormik(
      <PositionInput name="lat" labelText="Your latitude" type="latitude" />,
      { lat: "" }
    );

    const positionInput = getByRole("textbox", { name: "Your latitude" });
    await userEvent.type(positionInput, "10.123450", { delay: 1 });

    expect(getFormValues().lat).toEqual("10.123450");
  });

  it("validates min value", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput name="lat" labelText="Your latitude" type="latitude" />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("textbox", { name: "Your latitude" });
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
      <PositionInput name="lat" labelText="Your latitude" type="latitude" />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("textbox", { name: "Your latitude" });
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

  it("validates format to only allow digits", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput name="lat" labelText="Your latitude" type="latitude" />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("textbox", { name: "Your latitude" });
      await userEvent.type(positionInput, "15.123k56", { delay: 1 });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_POSITION_FORMAT
    );
    expect(getFormErrors().lat).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "Your latitude" })).toHaveTextContent(
      expectedErrorMessage
    );
  });

  it("displays error for less than 6 decimal digits", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput name="lat" labelText="Your latitude" type="latitude" />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("textbox", { name: "Your latitude" });
      await userEvent.type(positionInput, "15.12345", { delay: 1 });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_POSITION_FORMAT
    );
    expect(getFormErrors().lat).toEqual(expectedErrorMessage);
    expect(getByRole("alert", { name: "Your latitude" })).toHaveTextContent(
      expectedErrorMessage
    );
  });

  it("displays error for more than 6 decimal digits", async () => {
    const { getFormErrors, getByRole } = renderWithinFormik(
      <PositionInput name="lat" labelText="Your latitude" type="latitude" />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("textbox", { name: "Your latitude" });
      await userEvent.type(positionInput, "15.1234567", { delay: 1 });
      userEvent.click(positionInput);
      userEvent.tab();
    });

    const expectedErrorMessage = getErrorMessage(
      FormErrorType.INVALID_POSITION_FORMAT
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
      />,
      { lat: "" }
    );

    await act(async () => {
      const positionInput = getByRole("textbox", { name: "Your latitude *" });
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
      />,
      { defaultLat: "" }
    );

    await act(async () => {
      expect(getFormValues().defaultLat).toEqual("1.123456");
    });
  });
});
