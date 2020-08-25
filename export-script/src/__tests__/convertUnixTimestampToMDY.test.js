const convertUnixTimestampToMDY = require("../mappings/convertUnixTimestampToMDY");

describe("convertUnixTimestampToMDY", () => {
  it("converts a date from unix timestamp object to MDY", () => {
    const unixTimestamp = new Date(2019, 9, 15).getTime() / 1000;
    const timestampObject = { seconds: unixTimestamp, miliseconds: 0 };

    const convertedDate = convertUnixTimestampToMDY(timestampObject);

    expect(convertedDate).toEqual("10/15/2019");
  });

  it("strips leading zeros from the date", () => {
    const unixTimestamp = new Date(2019, 4, 5).getTime() / 1000;
    const timestampObject = { seconds: unixTimestamp, miliseconds: 0 };

    const convertedDate = convertUnixTimestampToMDY(timestampObject);

    expect(convertedDate).toEqual("5/5/2019");
  });

  it("maintains the same timezone", () => {
    const unixTimestamp = new Date(2019, 9, 15, 0, 0).getTime() / 1000;
    const timestampObject = { seconds: unixTimestamp, miliseconds: 0 };

    const convertedDate = convertUnixTimestampToMDY(timestampObject);

    expect(convertedDate).toEqual("10/15/2019");
  });
});
