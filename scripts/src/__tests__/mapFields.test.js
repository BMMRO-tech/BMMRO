const mapFields = require("../mapFields");

describe("mapFields", () => {
  it("maps fields according to passed config", () => {
    const testData = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
      { a: 7, b: 8, c: 9 },
    ];
    const config = { a: "A", b: "B", c: "C" };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { A: 1, B: 2, C: 3 },
      { A: 4, B: 5, C: 6 },
      { A: 7, B: 8, C: 9 },
    ]);
  });

  it("skips fields that are not present in the config", () => {
    const testData = [
      { a: 1, b: 2, c: 3, d: 2 },
      { a: 4, b: 5, c: 6, d: 1 },
      { a: 7, b: 8, c: 9 },
    ];
    const config = { a: "A", b: "B", c: "C" };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { A: 1, B: 2, C: 3 },
      { A: 4, B: 5, C: 6 },
      { A: 7, B: 8, C: 9 },
    ]);
  });

  it("should add a key from config if it is not present in data", () => {
    const testData = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
      { a: 7, b: 8, c: 9 },
    ];
    const config = { a: "A", b: "B", c: "C", d: "D" };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { A: 1, B: 2, C: 3, D: "" },
      { A: 4, B: 5, C: 6, D: "" },
      { A: 7, B: 8, C: 9, D: "" },
    ]);
  });
});
