import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { waitFor, fireEvent } from "@testing-library/react";

import { Datastore } from "../../datastore/datastore";
import EditLogbookEntry from "../EditLogbookEntry";

describe("EditLogbookEntry", () => {
  const defaultTrip = {
    area: "Central Andros",
    engineHoursMeterReading: "",
    exported: true,
    gpsFileName: "24_0517Mu.txt",
    hasEnded: true,
    numberOfObservers: 0,
    observers: "",
    project: "",
    time: "12:43",
    tripId: "24_0517Mu1",
    tripNumber: 1,
    vessel: "Multiple",
    windDirection: "",
    windSpeed: "",
  };

  const projectId = "edit-logbook-entry-test-id";
  let firestoreEmulator;
  let datastore;

  beforeAll(async () => {
    await initTestEnv(projectId);
  });

  beforeEach(() => {
    firestoreEmulator = getEmulatedFirestore();
    datastore = new Datastore(firestoreEmulator);
  });

  afterEach(async () => {
    await clearEmulatedData();
  });

  afterAll(async () => {
    await cleanupTestEnv();
  });

  it("navigates to trip overview page if no logbook entry is found in firestore for a given ID", async () => {
    const { id } = await firestoreEmulator.collection("trip").add({
      ...defaultTrip,
    });

    await firestoreEmulator
      .doc(`trip/${id}`)
      .collection("logbookEntry")
      .add({ time: "12:43", waterDepth: "", waterDepthBeyondSoundings: false });

    const entryPath = `/trips/${id}/logbook-entry/123/edit`;
    const redirectPath = `/trips/${id}/view`;

    const { history } = renderWithMockContexts(
      <EditLogbookEntry tripId={id} logbookId={"123"} />,
      {
        datastore,
        route: entryPath,
      },
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to logbook view page if logbook has been exported", async () => {
    const { id: tripId } = await firestoreEmulator.collection("trip").add({
      ...defaultTrip,
    });

    const { id: logbookId } = await firestoreEmulator
      .doc(`trip/${tripId}`)
      .collection("logbookEntry")
      .add({
        time: "12:43",
        waterDepth: "",
        waterDepthBeyondSoundings: false,
        exported: true,
      });

    const entryPath = `/trips/${tripId}/logbook-entry/${logbookId}/edit`;
    const redirectPath = `/trips/${tripId}/logbook-entry/${logbookId}/edit`;

    const { history, queryByTestId } = renderWithMockContexts(
      <EditLogbookEntry tripId={tripId} logbookId={logbookId} />,
      {
        datastore,
        route: entryPath,
      },
    );
    await waitFor(() => {
      expect(queryByTestId("exported-info")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  describe("delete logbook entry", () => {
    const addLogbookEntry = async (overrides = {}) => {
      const { id: tripId } = await firestoreEmulator.collection("trip").add({
        ...defaultTrip,
        exported: false,
        hasEnded: false,
      });

      const { id: logbookId } = await firestoreEmulator
        .doc(`trip/${tripId}`)
        .collection("logbookEntry")
        .add({
          time: "12:43",
          waterDepth: "",
          waterDepthBeyondSoundings: false,
          exported: false,
          hasEnded: false,
          ...overrides,
        });

      return { tripId, logbookId };
    };

    const renderEditPage = (tripId, logbookId) => {
      const entryPath = `/trips/${tripId}/logbook-entry/${logbookId}/edit`;

      return renderWithMockContexts(
        <EditLogbookEntry tripId={tripId} logbookId={logbookId} />,
        {
          datastore,
          route: entryPath,
        },
      );
    };

    it("shows delete button when entry is not exported and not hasEnded", async () => {
      const { tripId, logbookId } = await addLogbookEntry();

      const { queryByTestId } = renderEditPage(tripId, logbookId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
    });

    it("hides delete button when entry is exported", async () => {
      const { tripId, logbookId } = await addLogbookEntry({
        exported: true,
      });

      const { queryByTestId } = renderEditPage(tripId, logbookId);

      await waitFor(() => {
        expect(queryByTestId("exported-info")).toBeInTheDocument();
      });
      expect(queryByTestId("delete-entry-button")).not.toBeInTheDocument();
    });

    it("hides delete button when entry has hasEnded", async () => {
      const { tripId, logbookId } = await addLogbookEntry({
        hasEnded: true,
      });

      const { queryByTestId } = renderEditPage(tripId, logbookId);

      await waitFor(() => {
        expect(queryByTestId("saveLogBook")).toBeInTheDocument();
      });
      expect(queryByTestId("delete-entry-button")).not.toBeInTheDocument();
    });

    it("shows confirmation modal when delete button clicked", async () => {
      const { tripId, logbookId } = await addLogbookEntry();

      const { queryByTestId } = renderEditPage(tripId, logbookId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("delete-entry-button"));

      await waitFor(() => {
        expect(
          queryByTestId("delete-confirmation-modal"),
        ).toBeInTheDocument();
      });
    });

    it("calls deleteDocByPath with correct path on confirm", async () => {
      const { tripId, logbookId } = await addLogbookEntry();
      const deleteDocByPathSpy = vi.spyOn(datastore, "deleteDocByPath");

      const { queryByTestId } = renderEditPage(tripId, logbookId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("delete-entry-button"));

      await waitFor(() => {
        expect(queryByTestId("confirm-delete-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(deleteDocByPathSpy).toHaveBeenCalledWith(
          `trip/${tripId}/logbookEntry/${logbookId}`,
        );
      });
    });

    it("navigates to trip view after confirm", async () => {
      const { tripId, logbookId } = await addLogbookEntry();

      const { queryByTestId, history } = renderEditPage(tripId, logbookId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("delete-entry-button"));

      await waitFor(() => {
        expect(queryByTestId("confirm-delete-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(history.location.pathname).toEqual(`/trips/${tripId}/view`);
      });
    });

    it("does not call deleteDocByPath when cancelled", async () => {
      const { tripId, logbookId } = await addLogbookEntry();
      const deleteDocByPathSpy = vi.spyOn(datastore, "deleteDocByPath");

      const { queryByTestId } = renderEditPage(tripId, logbookId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("delete-entry-button"));

      await waitFor(() => {
        expect(queryByTestId("cancel-delete-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("cancel-delete-button"));

      await waitFor(() => {
        expect(
          queryByTestId("delete-confirmation-modal"),
        ).not.toBeInTheDocument();
      });
      expect(deleteDocByPathSpy).not.toHaveBeenCalled();
    });
  });
});
