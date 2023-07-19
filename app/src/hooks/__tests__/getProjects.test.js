import { Datastore } from "../../datastore/datastore";
import {getProjects} from "../getProjects";

describe("getProjects", () => {
  const testProjects = [
    {
      data: {
        projectName: "CtestProjectb",
      },
      id: "test1",
    },
    {
      data: {
        projectName: "ZtestProjectc",
      },
      id: "test2",
    },
    {
      data: {
        projectName: "BtestProjecta",
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
    const result = await getProjects(datastore);
    expect(result.current).not.toEqual([]);
    expect(result[0]).toEqual("BtestProjecta");
    expect(result[1]).toEqual("CtestProjectb");
    expect(result[2]).toEqual("ZtestProjectc");
  });
});
