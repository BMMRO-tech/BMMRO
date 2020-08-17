const convertToDecimal = require("../convertToDecimal");

describe("convertToDecimal", () => {
  it("converts the value to decimal when it's an integer", () => {
    const value = 5;
    const convertedToDecimal = convertToDecimal(value);

    expect(convertedToDecimal).toEqual(value.toFixed(1));
  });

  it("returns the value if it's already a decimal", () => {
    const returnedValue = convertToDecimal(5.1);

    expect(returnedValue).toEqual(5.1);
  });
});
