import { render, waitFor } from "@testing-library/react/pure";
import React from "react";
import Tabs from "../Tabs";
import { LocationProvider } from "@reach/router";
import { ROUTES } from "../../constants/routes";

describe("Tabs", () => {
  it("should include the Tabs", async () => {
    const { findByTestId } = render(
      <LocationProvider value={{ path: ROUTES.trips }}>
        <Tabs />
      </LocationProvider>
    );

    await waitFor(() => expect(findByTestId("tripsTab")).toBeTruthy());
    await waitFor(() => expect(findByTestId("encountersTab")).toBeTruthy());
  });
});
