const convertWaveHeightOption = require("../mappings/convertWaveHeightOption");

describe("convertWaveHeightOption", () => {
  it("converts to 99 when option is '6+'", () => {
    const convertedWaveHeight = convertWaveHeightOption("6+");

    expect(convertedWaveHeight).toEqual(99);
  });

  it("converts the option to a number when it's not '6+'", () => {
    const convertedWaveHeight = convertWaveHeightOption("120");

    expect(convertedWaveHeight).toEqual(120);
  });

  it("does not convert the option to a number when it's an empty string", () => {
    const convertedWaveHeight = convertWaveHeightOption("");

    expect(convertedWaveHeight).toEqual("");
  });
});
