import { renderWithMockContexts } from "../../utils/test/renderWithMockContexts";
import React from "react";
import * as firebaseTesting from "@firebase/testing";
import { waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Datastore } from "../../datastore/datastore";
import NewBiopsy from "../NewBiopsy";

describe("NewBiopsy", () => {
  const projectId = "new-biopsy-use-test-id";
  let firestoreEmulator;
  let datastore;

  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-05-04T11:30:12.000Z").getTime()
    );
  });

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

  it("firebase is called when form is submitted", async () => {
    const id = "800";
    await firestoreEmulator
      .collection("encounter")
      .doc(id)
      .set({
        name: "Barney",
        species: "Fin whale",
        date: new Date("2020-05-04T11:30:12.000Z"),
        time: "11:30:12",
        latitude: "15.123456",
        longitude: "-1.123456",
      });

    datastore.createSubDoc = jest.fn();

    const { findByRole, getByRole } = renderWithMockContexts(
      <NewBiopsy encounterId={id} />,
      {
        datastore,
      }
    );

    const speciesInput = getByRole("combobox", { name: "Species *" });
    const latitudeInput = getByRole("spinbutton", { name: "Lat" });
    const longitudeInput = getByRole("spinbutton", { name: "Long" });
    await userEvent.type(latitudeInput, "15.123456", { delay: 1 });
    await userEvent.type(longitudeInput, "1.123456", { delay: 1 });
    const saveBiopsyButton = await findByRole("button", {
      name: "Save",
    });

    userEvent.selectOptions(speciesInput, "Fin whale");
    userEvent.click(saveBiopsyButton);

    await waitFor(() => {
      expect(datastore.createSubDoc).toHaveBeenCalled();
    });
  });
});
