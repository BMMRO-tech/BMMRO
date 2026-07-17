vi.mock("fs");
vi.mock("../helpers/logAndExit");
vi.mock("../helpers/logToStdErrAndExit");
const fs = require("fs");
const writeDataToFile = require("../writeDataToFile");
const logAndExit = require("../helpers/logAndExit");
const logToStdErrAndExit = require("../helpers/logToStdErrAndExit");
const { vi } = require("vitest");

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
