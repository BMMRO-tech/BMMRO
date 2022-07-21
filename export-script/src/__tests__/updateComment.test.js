const updateComment = require("../updateComment");

describe("updateComment", () => {
  it("prepends GPS mark", () => {
    const gpsMark = 12;
    const comment = { comments: "Test comment" };
    const finalString = updateComment(gpsMark, comment);

    expect(finalString).toEqual(
      "GPS mark: 12. Test comment"
    );
  });

  it("doesn't append GPS mark if lat and long are present", () => {
    const gpsMark = 12;
    const comment = {
      comments: "Test comment",
      latitude: "0.111111",
      longitude: "0.111111",
    };
    const finalString = updateComment(gpsMark, comment);

    expect(finalString).toEqual("Test comment");
  });
});
