import fs from "fs";
import writeDataToFile from "../writeDataToFile.js";
import logAndExit from "../helpers/logAndExit.js";
import logToStdErrAndExit from "../helpers/logToStdErrAndExit.js";

vi.mock("fs");
vi.mock("../helpers/logAndExit.js");
vi.mock("../helpers/logToStdErrAndExit.js");

describe("writeDataToFile", () => {
  beforeAll(() => {
    fs.existsSync = vi.fn(() => true);
  });

  it("writes data to file", () => {
    writeDataToFile("dummyDir", "dummyFile", "test");

    expect(fs.writeFileSync).toHaveBeenCalledWith("dummyDir/dummyFile", "test");
  });

  it("exits the script if writing to file fails", () => {
    fs.writeFileSync = vi.fn(() => {
      throw new Error("🤬");
    });
    writeDataToFile("dummyDir", "dummyFile", "test");

    expect(logToStdErrAndExit).toHaveBeenCalledWith("🤬");
  });
});
