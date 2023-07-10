import { Datastore } from "../../datastore/datastore";
import projectDb from "../projectDb";

describe("projectDb", () => {
  const testProjects = [
    {
      data: {
        projectName: "testProject1",
      },
      id: "test1",
    },
    {
      data: {
        projectName: "testProject2",
      },
      id: "test2",
    },
    {
      data: {
        projectName: "testProject3",
      },
      id: "test3",
    },
  ];
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("reads project data from datastore", async () => {
    const datastore = new Datastore(undefined, undefined);
    jest
      .spyOn(datastore, "readDocsFromCollection")
      .mockResolvedValue(testProjects);
    const result = await projectDb(datastore);
    expect(result.current).not.toEqual([]);
    expect(result[0]).toEqual("testProject1");
    expect(result[1]).toEqual("testProject2");
    expect(result[2]).toEqual("testProject3");
  });
});
