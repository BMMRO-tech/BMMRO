import * as firebaseTesting from "@firebase/testing";
import { act, renderHook } from "@testing-library/react-hooks";

import { useEncountersByMonth } from "../useEncountersByMonth";
import testEncounters from "../__fixtures__/testEncounters";
import { Datastore } from "../../datastore/datastore";

describe("useEncountersByMonth", () => {
  const projectId = "use-encounters-by-month-test";
  let firestoreEmulator;
  let datastore;

  beforeAll(async () => {
    global.Date.now = jest.fn(() =>
      new Date("2000-01-15:23:00:00.000Z").getTime()
    );

    firestoreEmulator = firebaseTesting
      .initializeTestApp({
        projectId,
        auth: { uid: "test-researcher" },
      })
      .firestore();

    datastore = new Datastore(firestoreEmulator);

    for (const testEntry of testEncounters) {
      const id = testEntry.sequenceNumber;
      await firestoreEmulator.collection("encounter").doc(id).set(testEntry);
    }
  });

  afterAll(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("reads data for this month in reverse chronological order", async () => {
    const { result, waitFor } = renderHook(() =>
      useEncountersByMonth(datastore)
    );

    await act(async () => {
      await waitFor(() => {
        expect(result.current.todaysEncounters).not.toEqual([]);
        expect(result.current.previousEncounters).not.toEqual([]);
      });
    });

    const { todaysEncounters, previousEncounters } = result.current;
    const todaysEntriesSeqNos = todaysEncounters[0].entries.map(
      (entry) => entry.data.sequenceNumber
    );
    const previousEntriesSeqNos = previousEncounters[0].entries.map(
      (entry) => entry.data.sequenceNumber
    );
    expect(todaysEncounters[0].month).toEqual("January");
    expect(previousEncounters[0].month).toEqual("January");
    expect(todaysEncounters[0].year).toEqual(2000);
    expect(previousEncounters[0].year).toEqual(2000);
    expect(todaysEntriesSeqNos).toEqual(["TEST99", "TEST98", "TEST97"]);
    expect(previousEntriesSeqNos).toEqual(["TEST89", "TEST88", "TEST87"]);
  });

  it("returns a callback to read previous month's data", async () => {
    const { result, waitFor } = renderHook(() =>
      useEncountersByMonth(datastore)
    );
    await waitFor(() => {
      expect(result.current.todaysEncounters).not.toEqual([]);
      expect(result.current.previousEncounters).not.toEqual([]);
    });

    await act(async () => {
      result.current.loadPreviousMonth();
      await waitFor(() => {
        expect(result.current.previousEncounters[1]).toBeDefined();
      });
    });

    const { previousEncounters } = result.current;
    const currentMonthSeqNos = previousEncounters[0].entries.map(
      (entry) => entry.data.sequenceNumber
    );
    const previousMonthSeqNos = previousEncounters[1].entries.map(
      (entry) => entry.data.sequenceNumber
    );
    expect(previousEncounters[0].month).toEqual("January");
    expect(previousEncounters[1].month).toEqual("December");
    expect(previousEncounters[0].year).toEqual(2000);
    expect(previousEncounters[1].year).toEqual(1999);
    expect(currentMonthSeqNos).toEqual(["TEST89", "TEST88", "TEST87"]);
    expect(previousMonthSeqNos).toEqual(["TEST79", "TEST78", "TEST77"]);
  });

  it("returns an isLoading flag while encounters are being loaded", async () => {
    const { result, waitFor } = renderHook(() =>
      useEncountersByMonth(datastore)
    );
    await waitFor(() => {
      expect(result.current.todaysEncounters).not.toEqual([]);
      expect(result.current.previousEncounters).not.toEqual([]);
    });

    await act(async () => {
      result.current.loadPreviousMonth();

      await waitFor(() => expect(result.current.isLoading).toEqual(true));

      await waitFor(() =>
        expect(result.current.previousEncounters[1]).toBeDefined()
      );
    });

    expect(result.current.isLoading).toEqual(false);
  });

  it("returns empty entries if there are no entries for a month", async () => {
    const { result, waitFor } = renderHook(() =>
      useEncountersByMonth(datastore)
    );
    await waitFor(() => {
      expect(result.current.todaysEncounters).not.toEqual([]);
      expect(result.current.previousEncounters).not.toEqual([]);
    });
    await act(async () => {
      result.current.loadPreviousMonth();
      await waitFor(() => {
        expect(result.current.previousEncounters[1]).toBeDefined();
      });
    });

    await act(async () => {
      result.current.loadPreviousMonth();
      await waitFor(() => {
        expect(result.current.previousEncounters[2]).toBeDefined();
      });
    });

    const { previousEncounters } = result.current;
    expect(previousEncounters[2].month).toEqual("November");
    expect(previousEncounters[2].year).toEqual(1999);
    expect(previousEncounters[2].entries).toEqual([]);
  });
});
