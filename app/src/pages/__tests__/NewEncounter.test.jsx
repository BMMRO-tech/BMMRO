import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import {
  initTestEnv,
  getEmulatedFirestore,
  clearEmulatedData,
  cleanupTestEnv,
} from "../../utils/test/firestoreEmulator";
import { Datastore } from "../../datastore/datastore";
import NewEncounter from "../NewEncounter";

describe("NewEncounterPage", () => {
  const projectId = "new-encounter-test-id";
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

  it("show encounter and trips tabs", async () => {
    renderWithMockContexts(<NewEncounter />, {
      datastore,
    });

    await waitFor(() =>
      expect(
        screen.getByText("ENCOUNTERS", { selector: "button" }),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText("TRIPS", { selector: "button" }),
      ).toBeInTheDocument(),
    );
  });
  it("don't show new encounters button", async () => {
    renderWithMockContexts(<NewEncounter />, {
      datastore,
      route: "/encounters/new",
    });

    await waitFor(() =>
      expect(
        screen.queryByTestId("new-encounters-button"),
      ).not.toBeInTheDocument(),
    );
  });
});
