import * as firebaseTesting from "@firebase/testing";
import { act, renderHook } from "@testing-library/react-hooks";
import { Datastore } from "../../../datastore/datastore";
import projectDb from "../projectDb";
import { auth } from "firebase";

describe("projectDb", () => {
  const projectId = "projectDb-test";
  let firestoreEmulator;
  let datastore;
  const testProject = {
    projectName: "testProject",
  };

  beforeAll(async () => {
    firestoreEmulator = firebaseTesting
      .initializeTestApp({
        projectId,
        auth: { uid: "test-researcher" },
      })
      .firestore();

    datastore = new Datastore(firestoreEmulator);
    await firestoreEmulator.collection("project").doc("test").set(testProject);
  });

  afterAll(async () => {
    await firebaseTesting.clearFirestoreData({ projectId });
    await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
  });

  it("reads project data from datastore", async () => {
    const { result } = projectDb(datastore);

    await act(async () => {
      await waitFor(() => {
        expect(result.current).not.toEqual([]);
        expect(result.current).toEqual(testProject.projectName);
      });
    });
  });
});
