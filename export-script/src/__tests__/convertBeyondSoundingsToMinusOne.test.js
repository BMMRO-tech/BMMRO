const convertBeyondSoundingsToMinusOne = require("../mappings/convertBeyondSoundingsToMinusOne");

describe("convertBeyondSoundingsToMinusOne", () => {
  it("converts the option to '-1' when waterDepthBeyondSoundings is true", () => {
    const convertedEmptyToNotNoted = convertBeyondSoundingsToMinusOne("", {
      waterDepth: "",
      waterDepthBeyondSoundings: true,
    });
    expect(convertedEmptyToNotNoted).toEqual(-1);
  });

  it("returns value when waterDepthBeyondSoundings is false", () => {
    const convertedEmptyToNotNoted = convertBeyondSoundingsToMinusOne(3, {
      waterDepth: 3,
      waterDepthBeyondSoundings: false,
    });
    expect(convertedEmptyToNotNoted).toEqual(3);
  });
});
