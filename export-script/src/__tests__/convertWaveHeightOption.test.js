const convertWaveHeightOption = require("../convertWaveHeightOption");

describe("convertWaveHeightOption", () => {
  it("converts to '99' when option is '6+'", () => {
    const convertedWaveHeight = convertWaveHeightOption("6+");

    expect(convertedWaveHeight).toEqual("99");
  });

  it("returns the option when it's not '6+'", () => {
    const convertedWaveHeight = convertWaveHeightOption("some option");

    expect(convertedWaveHeight).toEqual("some option");
  });
});
