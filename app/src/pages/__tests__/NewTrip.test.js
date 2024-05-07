import React from "react";
import {screen, waitFor} from "@testing-library/react";
import {renderWithMockContexts} from "../../utils/test/renderWithMockContexts";
import * as firebaseTesting from "@firebase/testing";
import {Datastore} from "../../datastore/datastore";
import NewTrip from "../NewTrip";

describe("NewTripPage", () => {
  const projectId = "new-trip-test-id";
  let firestoreEmulator;
  let datastore;

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

  it("show encounter and trips tabs", async () => {
    renderWithMockContexts(<NewTrip />, {
      datastore,
    });

    await waitFor(() =>
      expect(
        screen.getByText("ENCOUNTERS", { selector: "button" })
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        screen.getByText("TRIPS", { selector: "button" })
      ).toBeInTheDocument()
    );
  });
  it("don't show new trips button", async () => {
    renderWithMockContexts(<NewTrip />, {
      datastore,
      route: "/trips/new",
    });

    await waitFor(() =>
      expect(screen.queryByTestId("new-trips-button")).not.toBeInTheDocument()
    );
  });
});
