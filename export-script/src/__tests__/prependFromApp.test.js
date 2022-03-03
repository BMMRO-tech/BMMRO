const prependFromApp = require("../mappings/prependFromApp");

describe("prependFromApp", () => {
  it("preappends data source info to string", () => {
    const originalString = "test string";

    const finalString = prependFromApp(originalString);

    expect(finalString).toEqual("From App: test string");
  });

  it("replaces empty comment with data source info", () => {
    const originalString = undefined;

    const finalString = prependFromApp(originalString);

    expect(finalString).toEqual("From App: ");
  });
});
