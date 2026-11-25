import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import ViewTrip from "../ViewTrip";
import userEvent from "@testing-library/user-event";

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
    time: "10:29:13",
    tripId: "24_0510Od123",
    tripNumber: 123,
    vessel: "Odyssey",
    windDirection: "",
    windSpeed: "",
    logbookComments: "",
    date: new Date("2020-05-04T11:30:12.000Z"),
    hasEnded: false,
    exported: false,
  };

  beforeAll(async () => {
    await initTestEnv(projectId);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    firestoreEmulator = getEmulatedFirestore();
    datastore = new Datastore(firestoreEmulator);
  });

  afterEach(async () => {
    await clearEmulatedData();
  });

  afterAll(async () => {
    await cleanupTestEnv();
    vi.clearAllMocks();
  });

  it("end trip button opens a pop-up where the user can add the trip miles", async () => {
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);

    renderWithMockContexts(<ViewTrip tripId={"123"} />, { datastore });
    const endButton = await waitFor(() => screen.getByText("End trip"));
    fireEvent.click(endButton);
    expect(
      screen.getByText("Are you sure you want to end this trip?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Trip miles")).toBeInTheDocument();
  });

  it("sets hasEnded to true when ending trip", async () => {
    mockTrip.exported = false;
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);
    renderWithMockContexts(<ViewTrip tripId={"123"} />, { datastore });
    const endButton = await waitFor(() => screen.getByText("End trip"));
    await act(async () => {
      await userEvent.click(endButton);
    });

    await waitFor(() =>
      screen.getByText("Are you sure you want to end this trip?"),
    );
    const confirmButton = await waitFor(() =>
      screen.getByText("Save & Continue"),
    );
    await act(async () => {
      await userEvent.click(confirmButton);
    });

    const endedTrip = (await firestoreEmulator.doc("trip/123").get()).data();
    await waitFor(() => {
      expect(endedTrip.hasEnded).toBe(true);
    });
  });

  it("show new logbook button when trip is not yet exported", async () => {
    const trip = {
      exported: false,
      ...mockTrip,
    };
    await firestoreEmulator.collection("trip").doc("123").set(trip);
    renderWithMockContexts(<ViewTrip tripId={"123"} />, { datastore });

    await waitFor(() =>
      expect(screen.getByTestId("newLogbook")).toBeInTheDocument(),
    );
  });
  it("does not show deleted logbook entries", async () => {
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);
    const logbookCollection = firestoreEmulator
      .doc("trip/123")
      .collection("logbookEntry");
    await logbookCollection.add({ time: "11:11", exported: false });
    await logbookCollection.add({
      time: "22:22",
      exported: false,
      deleted: true,
    });

    renderWithMockContexts(<ViewTrip tripId={"123"} />, { datastore });

    await waitFor(() => expect(screen.getByText("11:11")).toBeInTheDocument());
    expect(screen.queryByText("22:22")).not.toBeInTheDocument();
  });
  it("don't show new logbook button when trip has been exported", async () => {
    const trip = {
      exported: true,
      ...mockTrip,
    };
    await firestoreEmulator.collection("trip").doc("123").set(trip);
    renderWithMockContexts(<ViewTrip tripId={"123"} />, { datastore });

    await waitFor(() =>
      expect(screen.queryByTestId("newLogbook")).not.toBeInTheDocument(),
    );
  });

  it("end trip button disappears when the trip has already been exported", async () => {
    mockTrip.exported = true;
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);
    renderWithMockContexts(<ViewTrip tripId={"123"} />, {
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
        }),
      ).toHaveLength(1);
    });
  });

  it("last logbook entry is created with current time when ending a trip", async () => {
    mockTrip.exported = false;
    const originalDateNow = Date.now;
    Date.now = vi.fn(() => new Date("2020-05-04T11:30:12.000Z").getTime());
    await firestoreEmulator.collection("trip").doc("123").set(mockTrip);
    await firestoreEmulator
      .doc("trip/123")
      .collection("logbookEntry")
      .add({ time: "10:29:13" });

    const { rerender } = renderWithMockContexts(<ViewTrip tripId={"123"} />, {
      datastore,
    });
    await waitFor(() => {
      expect(screen.getByText("Logbook entry 1")).toBeInTheDocument();
    });
    const endButton = await waitFor(() => screen.getByText("End trip"));
    await act(async () => {
      await userEvent.click(endButton);
    });
    await waitFor(() =>
      screen.getByText("Are you sure you want to end this trip?"),
    );
    const confirmButton = await waitFor(() =>
      screen.getByText("Save & Continue"),
    );
    await act(async () => {
      await userEvent.click(confirmButton);
    });
    await waitFor(() => {
      expect(screen.getByText("Logbook entry 2")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("11:30:12")).toBeInTheDocument();
    });

    Date.now = originalDateNow;
  });

  describe("delete trip", () => {
    const addTrip = async (overrides = {}) => {
      const { id: tripId } = await firestoreEmulator
        .collection("trip")
        .add({ ...mockTrip, exported: false, hasEnded: false, ...overrides });
      return tripId;
    };

    const renderViewPage = (tripId) =>
      renderWithMockContexts(<ViewTrip tripId={tripId} />, {
        datastore,
        route: `/trips/${tripId}/view`,
      });

    it.each([
      ["an open trip", { exported: false, hasEnded: false }],
      ["an ended trip", { exported: false, hasEnded: true }],
      ["an exported trip", { exported: true, hasEnded: true }],
    ])("shows the delete button for %s", async (_, overrides) => {
      const tripId = await addTrip(overrides);

      renderViewPage(tripId);

      await waitFor(() =>
        expect(screen.getByTestId("delete-entry-button")).toBeInTheDocument(),
      );
    });

    it("opens a confirmation modal when the delete button is clicked", async () => {
      const tripId = await addTrip();

      renderViewPage(tripId);
      fireEvent.click(
        await waitFor(() => screen.getByTestId("delete-entry-button")),
      );

      expect(screen.getByText("Delete this trip?")).toBeInTheDocument();
    });

    it("closes the modal without deleting when cancel is clicked", async () => {
      const tripId = await addTrip();

      renderViewPage(tripId);
      fireEvent.click(
        await waitFor(() => screen.getByTestId("delete-entry-button")),
      );
      fireEvent.click(screen.getByTestId("cancel-delete-button"));

      await waitFor(() =>
        expect(
          screen.queryByTestId("delete-confirmation-modal"),
        ).not.toBeInTheDocument(),
      );
      const trip = (await firestoreEmulator.doc(`trip/${tripId}`).get()).data();
      expect(trip.deleted).toBeUndefined();
    });

    it("marks the trip and its logbook entries as deleted and navigates to the trips overview", async () => {
      const tripId = await addTrip();
      const logbookCollection = firestoreEmulator
        .doc(`trip/${tripId}`)
        .collection("logbookEntry");
      const { path: firstEntryPath } = await logbookCollection.add({
        time: "11:11",
        exported: false,
      });
      const { path: secondEntryPath } = await logbookCollection.add({
        time: "22:22",
        exported: false,
      });

      const { history } = renderViewPage(tripId);
      fireEvent.click(
        await waitFor(() => screen.getByTestId("delete-entry-button")),
      );
      fireEvent.click(screen.getByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(history.location.pathname).toEqual("/trips");
      });
      await waitFor(async () => {
        const docs = await Promise.all(
          [`trip/${tripId}`, firstEntryPath, secondEntryPath].map((path) =>
            firestoreEmulator.doc(path).get(),
          ),
        );
        docs.forEach((doc) => expect(doc.data().deleted).toBe(true));
      });
    });

    it("navigates to the trips overview if the trip has been deleted", async () => {
      const tripId = await addTrip({ deleted: true });

      const { history } = renderViewPage(tripId);

      await waitFor(() => {
        expect(history.location.pathname).toEqual("/trips");
      });
    });
  });
});
