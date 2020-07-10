
const prependFromFirestore = require("../prependFromFirestore");

describe("prependFromFirestore", () => {
  it("adds some text at the beginning of a string", () => {
    const originalString = "test string";

    const finalString = prependFromFirestore(originalString);

    expect(finalString).toEqual("From cloud firestore: test string");
  });
});