const updateComment = require("../updateComment");

describe("updateComment", () => {
  it("prepends GPS mark followed by from cloud firestore", () => {
    const gpsMark = 12;
    const comment = { comments: "Test comment" };
    const finalString = updateComment(gpsMark, comment);

    expect(finalString).toEqual(
      "From cloud firestore: GPS mark: 12. Test comment"
    );
  });
});
