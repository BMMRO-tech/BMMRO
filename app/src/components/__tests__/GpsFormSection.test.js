import React from "react";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { configure } from "@testing-library/dom";
import GpsFormSection from "../GpsFormSection";
import renderWithinFormik from "../../utils/test/renderWithinFormik";
import { getPosition } from "../formFields/PositionInput/getPosition.js";

configure({ asyncUtilTimeout: 8000 });
jest.mock("../formFields/PositionInput/getPosition.js");

describe("GpsFormSection", () => {
  it("refresh long & lat on click of the refresh button and disables button", async () => {
    const expectedCoordsOnLoad = {
      latitude: "1.123456",
      longitude: "-2.234567",
    };
    const expectedCoordsOnRefresh = {
      latitude: "9.123456",
      longitude: "-8.234567",
    };

    getPosition
      .mockReturnValueOnce({ position: expectedCoordsOnLoad, error: null })
      .mockReturnValueOnce({ position: expectedCoordsOnRefresh, error: null });

    const { getByRole, getByTestId } = renderWithinFormik(
      <GpsFormSection isViewOnly={false} />,
      { latitude: "", longitude: "" }
    );

    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });

    await waitFor(() => {
      expect(latitudeInput.value).toEqual(expectedCoordsOnLoad.latitude);
      expect(longitudeInput.value).toEqual(expectedCoordsOnLoad.longitude);
    });

    userEvent.click(getByTestId("Refresh"));

    await waitFor(async () => {
      expect(getByTestId("Refresh")).toHaveAttribute("disabled");
    });

    const updatedLatitudeInput = getByRole("spinbutton", { name: "Lat" });
    const updatedLongitudeInput = getByRole("spinbutton", { name: "Long" });

    await waitFor(async () => {
      expect(getPosition).toHaveBeenCalledTimes(2);
      expect(updatedLatitudeInput.value).toEqual(
        expectedCoordsOnRefresh.latitude
      );
      expect(updatedLongitudeInput.value).toEqual(
        expectedCoordsOnRefresh.longitude
      );
      expect(getByTestId("Refresh")).not.toHaveAttribute("disabled");
    });
  });

  it("Shows error message when the refresh button cannot obtain positional data", async () => {
    getPosition.mockReturnValue({ position: null, error: true });

    const { getByText } = renderWithinFormik(<GpsFormSection />);

    await waitFor(async () => {
      expect(getPosition).toHaveBeenCalled();
    });

    await waitFor(async () => {
      expect(
        getByText("Geolocation could not be retrieved.")
      ).toBeInTheDocument();
    });
  });

  it("shows info label if isRenderInfoLabel is true", async () => {
    const { getByText } = renderWithinFormik(
      <GpsFormSection isRenderInfoLabel={true} />
    );

    await waitFor(async () => {
      expect(
        getByText("Please add either latitude and longitude, or a GPS mark.")
      ).toBeInTheDocument();
    });
  });
});
