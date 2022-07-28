const convertAgeToInitial = require("../mappings/convertAgeToInitial");

describe("convertAgeToInitial", () => {
  it("converts 'calf' to 'C'", () => {
    const result = convertAgeToInitial("calf");
    expect(result).toEqual('C');
  });

  it("converts 'juvenile' to 'J'", () => {
    const result = convertAgeToInitial("juvenile");
    expect(result).toEqual('J');
  });

  it("converts 'subadult' to 'SA'", () => {
    const result = convertAgeToInitial("subadult");
    expect(result).toEqual('SA');
  });

  it("converts 'adult' to 'A'", () => {
    const result = convertAgeToInitial("Adult");
    expect(result).toEqual('A');
  });

  it("converts 'unknown' to 'U'", () => {
    const result = convertAgeToInitial("unknown");
    expect(result).toEqual('U');
  });

  it("converts '' to ''", () => {
    const result = convertAgeToInitial("");
    expect(result).toEqual('');
  });
});