jest.mock("fs");
jest.mock("../helpers/logAndExit");
jest.mock("../helpers/logToStdErrAndExit");
const fs = require("fs");
const writeDataToFile = require("../writeDataToFile");
const logAndExit = require("../helpers/logAndExit");
const logToStdErrAndExit = require("../helpers/logToStdErrAndExit");

describe("writeDataToFile", () => {
  beforeAll(() => {
    fs.existsSync = jest.fn(() => true);
  });

  it("can write data to file", () => {
    writeDataToFile("dummyDir", "dummyFile", "test");

    expect(fs.writeFileSync).toHaveBeenCalledWith("dummyDir/dummyFile", "test");
  });

  it("exits the script if writing to file fails", () => {
    fs.writeFileSync = jest.fn(() => {
      throw new Error("🤬");
    });
    writeDataToFile("dummyDir", "dummyFile", "test");

    expect(logToStdErrAndExit).toHaveBeenCalledWith("🤬");
  });
});
