const convertSkinToBool = require("../mappings/convertSkinAndBlubberToBool");

describe("convertSkinAndBlubberToBool", () => {
  it("converts 'Skin & blubber' to true", () => {
    const result = convertSkinToBool("Skin & blubber");
    expect(result).toBeTruthy();
  });

  it("converts 'Skin' to false", () => {
    const result = convertSkinToBool("Skin");
    expect(result).toBeFalsy();
  });

  it("converts empty string to false", () => {
    const result = convertSkinToBool("");
    expect(result).toBeFalsy();
  });
});
