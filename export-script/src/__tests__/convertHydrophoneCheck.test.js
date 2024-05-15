const convertHydrophoneCheck = require("../mappings/convertHydrophoneCheck");

describe("convertHydrophoneCheck", () => {
  it("converts the value to '0' when it's 'No'", () => {
    const value = "No";
    const convertedToZero = convertHydrophoneCheck(value);

    expect(convertedToZero).toEqual(0);
  });

  it("returns the value if it's not 'No'", () => {
    const value = "Yes";
    const convertedToZero = convertHydrophoneCheck(value);

    expect(convertedToZero).toEqual(-1);
  });
});
