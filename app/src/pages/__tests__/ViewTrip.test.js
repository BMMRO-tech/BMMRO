import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import {
  act,
  fireEvent,
  queryByRole,
  screen,
  waitFor,
} from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import ViewTrip from "../ViewTrip";
import OpenEncounter from "../OpenEncounter";
import userEvent from "@testing-library/user-event";
import { useLocation } from "@reach/router";

describe("ViewTrip", () => {
  const projectId = "view-trip-test";
  let firestoreEmulator;
  let datastore;
  const mockTrip = {
    area: "East Berry Islands",
    engineHoursMeterReading: "",
    gpsFileName: "24_0510-Od.txt",
    numberOfObservers: 0,
    observers: "",
    project: "",
    time: "10:29",
    tripId: "24_0510Od123",
    tripNumber: 123,
    vessel: "Odyssey",
    windDirection: "",
    windSpeed: "",
    date: new Date("2020-05-04T11:30:12.000Z"),
    hasEnded: false,
  };

  beforeEach(() => {
    firestoreEmulator = firebaseTesting
      .initializeTestApp({
        projectId,
        auth: { uid: "test-researcher" },
      })
      .firestore();

    datastore = new Datastore(firestoreEmulator);
  });

  afterAll(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  //todo: add the trip miles
  it("end trip button opens a pop-up where people can add the trip miles", async () => {
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);

    renderWithMockContexts(<ViewTrip tripId={"123"} />, { datastore });
    const endButton = await waitFor(() => screen.getByText("End trip"));
    fireEvent.click(endButton);
    expect(
      screen.getByText("Are you sure you want to end this trip?")
    ).toBeInTheDocument();
  });

  it("sets hasEnded to true when ending trip", async () => {
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);
    renderWithMockContexts(<ViewTrip tripId={"123"} />, { datastore });
    const endButton = await waitFor(() => screen.getByText("End trip"));
    await act(async () => {
      userEvent.click(endButton);
    });
    await waitFor(() =>
      screen.getByText("Are you sure you want to end this trip?")
    );
    const confirmButton = await waitFor(() =>
      screen.getByText("Save & Continue")
    );
    await act(async () => {
      userEvent.click(confirmButton);
    });

    const endedTrip = (await firestoreEmulator.doc("trip/123").get()).data();
    await waitFor(() => {
      expect(endedTrip.hasEnded).toBe(true);
    });
  });

  it("end trip button disappears when the trip has already been exported", async () => {
    const trip = {
      exported: true,
      ...mockTrip,
    };
    await firestoreEmulator.collection("trip").doc("123").set(trip);
    const { findByRole } = renderWithMockContexts(<ViewTrip tripId={"123"} />, {
      datastore,
    });
    const endButton = await screen.queryByRole("button", {
      name: "End trip",
    });

    await waitFor(() => {
      expect(endButton).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getAllByRole("link", {
          name: "Return to trip overview",
        })
      ).toHaveLength(2);
    });
  });
});