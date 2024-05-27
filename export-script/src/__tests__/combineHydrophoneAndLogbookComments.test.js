const combineHydrophoneAndLogbookComments = require("../combineHydrophoneAndLogbookComments");

describe("combineHydrophoneAndLogbookComments", () => {
  it("prepends GPS mark", () => {
    const gpsMark = 12;
    const values = { hydrophoneComments: "Test is hydrophone comment", logbookComments: "Test is logbook comment" };
    const finalString = combineHydrophoneAndLogbookComments(gpsMark, values);

    expect(finalString).toEqual(
      "GPS mark: 12. Test is hydrophone comment. Test is logbook comment"
    );
  });

  it("doesn't append GPS mark if lat and long are present", () => {
    const gpsMark = 12;
    const values = {
      hydrophoneComments: "Test is hydrophone comment", 
      logbookComments: "Test is logbook comment",
      latitude: "0.111111",
      longitude: "0.111111",
    };
    const finalString = combineHydrophoneAndLogbookComments(gpsMark, values);

    expect(finalString).toEqual("Test is hydrophone comment. Test is logbook comment");
  });
});
