const parseArgs = require("../parseArgs");

describe("parseArgs", () => {
  it("parses startDate and endDate", () => {
    const args = [
      "node version",
      "entrypoint filename",
      "31/12/2018",
      "01/01/2019",
    ];

    const parseArgsStatus = parseArgs(args);

    expect(parseArgsStatus.isSuccessful()).toBe(true);
    expect(parseArgsStatus.value).toEqual({
      startDate: new Date("12/31/2018"),
      endDate: new Date("01/01/2019"),
    });
  });

  it("ensures you pass in startDate", () => {
    const args = ["node version", "entrypoint filename", "dummy endDate"];

    const parseArgsStatus = parseArgs(args);

    expect(parseArgsStatus.isSuccessful()).toBe(false);
    expect(parseArgsStatus.status).toEqual("MISSING_ARG");
  });

  it("validates date format for startDate", () => {
    const args = [
      "node version",
      "entrypoint filename",
      "January-01-2019",
      "01/02/2019",
    ];

    const parseArgsStatus = parseArgs(args);

    expect(parseArgsStatus.isSuccessful()).toBe(false);
    expect(parseArgsStatus.status).toEqual("INVALID_DATE_FORMAT");
  });

  it("validates date format for endDate", () => {
    const args = [
      "node version",
      "entrypoint filename",
      "01/01/2019",
      "January-02-2019",
    ];

    const parseArgsStatus = parseArgs(args);

    expect(parseArgsStatus.isSuccessful()).toBe(false);
    expect(parseArgsStatus.status).toEqual("INVALID_DATE_FORMAT");
  });

  it("validates that endDate is after startDate", () => {
    const args = [
      "node version",
      "entrypoint filename",
      "01/01/2019",
      "31/12/2018",
    ];

    const parseArgsStatus = parseArgs(args);

    expect(parseArgsStatus.isSuccessful()).toBe(false);
    expect(parseArgsStatus.status).toEqual("END_DATE_BEFORE_START_DATE");
  });
});
