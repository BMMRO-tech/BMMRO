const addGpsMark = require("../addGpsMarkToComments");

describe("addGpsMarkToComments", () => {
    it("prepends GPS mark to comment section", () => {
        const gpsMark = 12;
        const comment = "Test comment"
        const finalString = addGpsMark(gpsMark, comment);
    
        expect(finalString).toEqual("GPS mark: 12. Test comment");
      });
});