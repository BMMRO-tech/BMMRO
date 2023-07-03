const mapFields = require("../mapFields");

describe("mapFields", () => {
  it("maps fields according to passed config", () => {
    const testData = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
      { a: 7, b: 8, c: 9 },
    ];
    const config = { A: { key: "a" }, B: { key: "b" }, C: { key: "c" } };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { A: 1, B: 2, C: 3 },
      { A: 4, B: 5, C: 6 },
      { A: 7, B: 8, C: 9 },
    ]);
  });

  it("transforms a field value by a callback in the config", () => {
    const testData = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
      { a: 7, b: 8, c: 9 },
    ];
    const double = (num) => num * 2;
    const config = {
      A: { key: "a" },
      B: { key: "b", transform: double },
      C: { key: "c" },
    };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { A: 1, B: 4, C: 3 },
      { A: 4, B: 10, C: 6 },
      { A: 7, B: 16, C: 9 },
    ]);
  });

  it("skips fields that are not present in the config", () => {
    const testData = [
      { a: 1, b: 2, c: 3, d: 2 },
      { a: 4, b: 5, c: 6, d: 1 },
      { a: 7, b: 8, c: 9 },
    ];
    const config = { A: { key: "a" }, B: { key: "b" }, C: { key: "c" } };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { A: 1, B: 2, C: 3 },
      { A: 4, B: 5, C: 6 },
      { A: 7, B: 8, C: 9 },
    ]);
  });

  it("adds a key from config if it is not present in data", () => {
    const testData = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
      { a: 7, b: 8, c: 9 },
    ];
    const config = {
      A: { key: "a" },
      B: { key: "b" },
      C: { key: "c" },
      D: { key: "" },
    };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { A: 1, B: 2, C: 3, D: "" },
      { A: 4, B: 5, C: 6, D: "" },
      { A: 7, B: 8, C: 9, D: "" },
    ]);
  });

  it("does not convert 0 to empty string", () => {
    const testData = [{ a: 1, b: 0, c: undefined }];
    const config = {
      A: { key: "a" },
      B: { key: "b" },
      C: { key: "c" },
      D: { key: "" },
    };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([{ A: 1, B: 0, C: "", D: "" }]);
  });

  it("transforms fields based on other field values", () => {
    const testData = [{ a: 1, b: 1, c: 1 }];
    const config = {
      A: { key: "a" },
      B: { key: "b" },
      C: {
        key: "c",
        transform: (val, data) => data.a + data.b + val,
      },
    };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([{ A: 1, B: 1, C: 3 }]);
  });

  it("maps fields according to passed config for nested field", () => {
    const testData = [
      { a: {x: 1, y: 2, z: 3}}
    ];
    const config = { X: { key: "a.x" }, Y: { key: "a.y" }, Z: { key: "a.z" } };

    const mappedFields = mapFields(testData, config);

    expect(mappedFields).toEqual([
      { X: 1, Y: 2, Z: 3 },
    ]);
  });
});
