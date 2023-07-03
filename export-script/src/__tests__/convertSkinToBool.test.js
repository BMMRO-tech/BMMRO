const convertSkinToBool = require("../mappings/convertSkinToBool");

describe("convertSkinToBool", () => {
  it("converts 'Skin' to true", () => {
    const result = convertSkinToBool("Skin");
    expect(result).toBeTruthy();
  });

  it("converts 'Skin & blubber' to true", () => {
    const result = convertSkinToBool("Skin & blubber");
    expect(result).toBeTruthy();
  });

  it("converts empty string to false", () => {
    const result = convertSkinToBool("");
    expect(result).toBeFalsy();
  });
});
