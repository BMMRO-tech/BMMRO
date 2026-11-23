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
import EditBiopsy from "../EditBiopsy";

describe("EditBiopsy", () => {
  const defaultEncounter = {
    area: "Central Abaco",
    startTimestamp: "Thu Jul 14 2022 11:56:43 GMT+0100",
    startTime: "16:57",
    endTimestamp: "Thu Jul 14 2022 11:57:43 GMT+0100",
    endTime: "16:58",
    sequenceNumber: "17111253",
    species: "Blainville's beaked whale",
  };
  const projectId = "edit-biopsy-test-id";
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

  it("navigates to encounter overview page if no biopsy is found in firestore for a given ID", async () => {
    const { id } = await firestoreEmulator
      .collection("encounter")
      .add({ name: "Barney", species: "Bottlenose dolphin" });

    await firestoreEmulator
      .doc(`encounter/${id}`)
      .collection("biopsy")
      .add({ samplerName: "Homer Simpson", species: "Bottlenose dolphin" });

    const entryPath = `/encounters/${id}/biopsy/123/edit`;
    const redirectPath = `/encounters/${id}/habitat-uses`;

    const { history } = renderWithMockContexts(
      <EditBiopsy encounterId={id} biopsyId={"123"} />,
      {
        datastore,
        route: entryPath,
      },
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(redirectPath);
    });
  });

  it("navigates to encounter overview page if the biopsy has been deleted", async () => {
    const { id: encounterId } = await firestoreEmulator
      .collection("encounter")
      .add({
        ...defaultEncounter,
      });

    const { id: biopsyId } = await firestoreEmulator
      .doc(`encounter/${encounterId}`)
      .collection("biopsy")
      .add({ deleted: true });

    const { history } = renderWithMockContexts(
      <EditBiopsy encounterId={encounterId} biopsyId={biopsyId} />,
      {
        datastore,
        route: `/encounters/${encounterId}/biopsies/${biopsyId}/edit`,
      },
    );

    await waitFor(() => {
      expect(history.location.pathname).toEqual(
        `/encounters/${encounterId}/habitat-uses`,
      );
    });
  });

  describe("delete biopsy", () => {
    const addBiopsy = async (overrides = {}) => {
      const { id: encounterId } = await firestoreEmulator
        .collection("encounter")
        .add({
          ...defaultEncounter,
          exported: false,
        });

      const { id: biopsyId } = await firestoreEmulator
        .doc(`encounter/${encounterId}`)
        .collection("biopsy")
        .add({
          dateTaken: "Thu Jul 14 2022 11:56:43 GMT+0100",
          species: "Fraser's dolphin",
          exported: false,
          ...overrides,
        });

      return { encounterId, biopsyId };
    };

    const renderEditPage = (encounterId, biopsyId) => {
      const entryPath = `/encounters/${encounterId}/biopsies/${biopsyId}/edit`;

      return renderWithMockContexts(
        <EditBiopsy encounterId={encounterId} biopsyId={biopsyId} />,
        {
          datastore,
          route: entryPath,
        },
      );
    };

    it("shows delete button", async () => {
      const { encounterId, biopsyId } = await addBiopsy();

      const { queryByTestId } = renderEditPage(encounterId, biopsyId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
    });

    it("does not show delete button if the biopsy has been exported", async () => {
      const { encounterId, biopsyId } = await addBiopsy({ exported: true });

      const { queryByTestId } = renderEditPage(encounterId, biopsyId);

      await waitFor(() => {
        expect(queryByTestId("field-species")).toBeInTheDocument();
      });
      expect(queryByTestId("delete-entry-button")).not.toBeInTheDocument();
    });

    it("shows confirmation modal when delete button clicked", async () => {
      const { encounterId, biopsyId } = await addBiopsy();

      const { queryByTestId } = renderEditPage(encounterId, biopsyId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("delete-entry-button"));

      await waitFor(() => {
        expect(queryByTestId("delete-confirmation-modal")).toBeInTheDocument();
      });
    });

    it("marks the entry as deleted via updateDocByPath on confirm and persists it", async () => {
      const { encounterId, biopsyId } = await addBiopsy();
      const updateDocByPathSpy = vi.spyOn(datastore, "updateDocByPath");

      const { queryByTestId } = renderEditPage(encounterId, biopsyId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("delete-entry-button"));

      await waitFor(() => {
        expect(queryByTestId("confirm-delete-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(updateDocByPathSpy).toHaveBeenCalledWith(
          `encounter/${encounterId}/biopsy/${biopsyId}`,
          { deleted: true },
        );
      });

      // handleDelete does not await the update, so poll for the stored value
      await waitFor(async () => {
        const storedBiopsy = (
          await firestoreEmulator
            .doc(`encounter/${encounterId}/biopsy/${biopsyId}`)
            .get()
        ).data();
        expect(storedBiopsy.deleted).toBe(true);
      });
    });

    it("navigates to encounter view after confirm", async () => {
      const { encounterId, biopsyId } = await addBiopsy();

      const { queryByTestId, history } = renderEditPage(encounterId, biopsyId);

      await waitFor(() => {
        expect(queryByTestId("delete-entry-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("delete-entry-button"));

      await waitFor(() => {
        expect(queryByTestId("confirm-delete-button")).toBeInTheDocument();
      });
      fireEvent.click(queryByTestId("confirm-delete-button"));

      await waitFor(() => {
        expect(history.location.pathname).toEqual(
          `/encounters/${encounterId}/habitat-uses`,
        );
      });
    });

    it("does not call updateDocByPath when cancelled", async () => {
      const { encounterId, biopsyId } = await addBiopsy();
      const updateDocByPathSpy = vi.spyOn(datastore, "updateDocByPath");

      const { queryByTestId } = renderEditPage(encounterId, biopsyId);

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
      expect(updateDocByPathSpy).not.toHaveBeenCalled();
    });
  });
});
