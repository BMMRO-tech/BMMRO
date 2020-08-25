const prependFromFirestore = require("../mappings/prependFromFirestore");

describe("prependFromFirestore", () => {
  it("preappends data source info to string", () => {
    const originalString = "test string";

    const finalString = prependFromFirestore(originalString);

    expect(finalString).toEqual("From cloud firestore: test string");
  });

  it("replaces empty comment with data source info", () => {
    const originalString = undefined;

    const finalString = prependFromFirestore(originalString);

    expect(finalString).toEqual("From cloud firestore: ");
  });
});
