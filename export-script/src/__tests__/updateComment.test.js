const updateComment = require("../updateComment");

describe("updateComment", () => {
  it("prepends GPS mark followed by from App", () => {
    const gpsMark = 12;
    const comment = { comments: "Test comment" };
    const finalString = updateComment(gpsMark, comment);

    expect(finalString).toEqual(
      "From App: GPS mark: 12. Test comment"
    );
  });

  it("only prepends from App if latitude, longitude and gps mark are all present", () => {
    const gpsMark = 12;
    const comment = {
      comments: "Test comment",
      latitude: "0.111111",
      longitude: "0.111111",
    };
    const finalString = updateComment(gpsMark, comment);

    expect(finalString).toEqual("From App: Test comment");
  });
});
