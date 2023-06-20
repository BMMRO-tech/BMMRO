import React from "react";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { configure } from "@testing-library/dom";
import GpsFormSection from "../GpsFormSection";
import renderWithinFormik from "../../utils/test/renderWithinFormik";
import { getPosition } from "../formFields/PositionInput/getPosition.js";

configure({ asyncUtilTimeout: 12000 });
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

    await waitFor(() => {
      expect(getByRole("spinbutton", { name: "Lat" }).value).toEqual(
        expectedCoordsOnLoad.latitude
      );
      expect(getByRole("spinbutton", { name: "Long" }).value).toEqual(
        expectedCoordsOnLoad.longitude
      );
    });

    userEvent.click(getByTestId("Refresh"));

    await waitFor(async () => {
      expect(getByTestId("Refresh")).toHaveAttribute("disabled");
    });

    await waitFor(async () => {
      expect(getPosition).toHaveBeenCalledTimes(2);
      expect(getByRole("spinbutton", { name: "Lat" }).value).toEqual(
        expectedCoordsOnRefresh.latitude
      );
      expect(getByRole("spinbutton", { name: "Long" }).value).toEqual(
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
