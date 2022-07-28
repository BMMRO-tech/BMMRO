const convertSexToInitials = require("../mappings/convertSexToInitials");

describe("convertSexToInitials", () => {
  it("converts the option sex options to initials", () => {
    const convertedMaleToM = convertSexToInitials("male");
    const convertedFemaleToF = convertSexToInitials("female");
    const convertedUnknownToU = convertSexToInitials("unknown");
    const convertedEmptyToBlank = convertSexToInitials("");

    expect(convertedMaleToM).toEqual("M");
    expect(convertedFemaleToF).toEqual("F");
    expect(convertedUnknownToU).toEqual("U");
    expect(convertedEmptyToBlank).toEqual("");
    
  });
});