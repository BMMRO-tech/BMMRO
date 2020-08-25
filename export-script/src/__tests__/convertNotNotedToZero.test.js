const convertNotNotedToZero = require("../mappings/convertNotNotedToZero");

describe("convertNotNotedToZero", () => {
  it("converts the value to 0 when it's 'not-noted'", () => {
    const value = "not-noted";
    const convertedToZero = convertNotNotedToZero(value);

    expect(convertedToZero).toEqual(0);
  });

  it("returns the value if it's not 'not-noted'", () => {
    const value = true;
    const convertedToZero = convertNotNotedToZero(value);

    expect(convertedToZero).toEqual(true);
  });
});
