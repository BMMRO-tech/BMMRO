const convertDateToMDY = require("../convertDateToMDY");

describe("convertDateToMDY", () => {
  it("converts a date from DMY to MDY", () => {
    const dmyDate = "15/10/2019";

    const convertedDate = convertDateToMDY(dmyDate);

    expect(convertedDate).toEqual("10/15/2019");
  });

  it("strips trailing zeros from the date", () => {
    const dmyDate = "03/09/2019";

    const convertedDate = convertDateToMDY(dmyDate);

    expect(convertedDate).toEqual("9/3/2019");
  });
});
