const convertEmptyToNotNoted = require("../mappings/convertEmptyToNotNoted");

describe("convertEmptyToNotNoted", () => {
  it("converts the option to 'Not Noted' when it's not empty", () => {
    const convertedEmptyToNotNoted = convertEmptyToNotNoted("");

    expect(convertedEmptyToNotNoted).toEqual("Not Noted");
  });

  it("does not convert the option to 'Not Noted' when it's not empty", () => {
    const convertedEmptyToNotNoted = convertEmptyToNotNoted("some value");

    expect(convertedEmptyToNotNoted).toEqual("some value");
  });
});
