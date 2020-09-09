const convertBeyondSoundingsTo9999 = require("../mappings/convertBeyondSoundingsTo9999");

describe("convertBeyondSoundingsTo9999", () => {
  it("converts the option to '9999' when waterDepthBeyondSoundings is true", () => {
    const convertedEmptyToNotNoted = convertBeyondSoundingsTo9999("", {
      waterDepth: "",
      waterDepthBeyondSoundings: true,
    });
    expect(convertedEmptyToNotNoted).toEqual(9999);
  });

  it("returns value when waterDepthBeyondSoundings is false", () => {
    const convertedEmptyToNotNoted = convertBeyondSoundingsTo9999(3, {
      waterDepth: 3,
      waterDepthBeyondSoundings: false,
    });
    expect(convertedEmptyToNotNoted).toEqual(3);
  });
});
