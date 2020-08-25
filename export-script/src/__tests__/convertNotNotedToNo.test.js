const convertNotNotedToNo = require("../mappings/convertNotNotedToNo");

describe("convertNotNotedToNo", () => {
  it("converts the value to 'no' when it's 'not-noted'", () => {
    const value = "not-noted";
    const convertedToZero = convertNotNotedToNo(value);

    expect(convertedToZero).toEqual("No");
  });

  it("returns the value if it's not 'not-noted'", () => {
    const value = true;
    const convertedToZero = convertNotNotedToNo(value);

    expect(convertedToZero).toEqual(true);
  });
});
