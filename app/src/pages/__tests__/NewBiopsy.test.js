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
        //const ModalText = "positional-data-modal";
        const id = "800";
        await firestoreEmulator.collection("encounter").doc(id).set({
          name: "Barney",
          species: "Bottlenose dolphin",
          date: new Date("2020-05-04T11:30:12.000Z"),
          time: "11:30:12",
          latitude: "15.123456",
          longitude: "-1.123456",
        });
    
        datastore.createSubDoc = jest.fn();
    
        const { findByRole, queryByTestId } = renderWithMockContexts(
          <NewBiopsy encounterId={id} />,
          {
            datastore,
          }
        );
    
        const saveBiopsyButton = await findByRole("button", {
          name: "Save",
        });
    
        await act(async () => {
          userEvent.click(saveBiopsyButton);
        });
    
        //expect(queryByTestId(ModalText)).toBeInTheDocument();

        expect(datastore.createSubDoc).toHaveBeenCalled();
      });
});