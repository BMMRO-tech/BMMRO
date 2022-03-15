const addGpsMark = require("../addGpsMarkToComments");

describe("addGpsMarkToComments", () => {
  it("prepends GPS mark to comment section", () => {
    const gpsMark = 12;
    const comment = "Test comment";
    const finalString = addGpsMark(gpsMark, comment);

    expect(finalString).toEqual("GPS mark: 12. Test comment");
  });

  it("converts empty comment to empty string", () => {
    const gpsMark = 12;
    const comment = "";
    const finalString = addGpsMark(gpsMark, comment);

    expect(finalString).toEqual("GPS mark: 12. ");
  });

  it("doesn't add gps mark if none supplied", () => {
    const gpsMark = "";
    const comment = "";
    const finalString = addGpsMark(gpsMark, comment);

    expect(finalString).toEqual("");
  });
});
