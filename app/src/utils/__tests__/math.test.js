import { roundNumber, appendZeros, getModifiedProperties } from "../math";

describe("math", () => {
  describe("roundNumber", () => {
    it("rounds a number to expected precision", () => {
      expect(roundNumber("1.23456", 3)).toEqual(1.235);
    });

    it("rounds a number to the nearest integer by default", () => {
      expect(roundNumber("1.23456")).toEqual(1);
    });
  });

  describe("appendZeros", () => {
    it("appends as many zeros as necessary to fulfil provided precision", () => {
      expect(appendZeros(0.123, 6)).toEqual("0.123000");
    });

    it("also works for integers", () => {
      expect(appendZeros(2, 5)).toEqual("2.00000");
    });
  });

  describe("getModifiedProperties", () => {
    it("returns modified simple properties between original and modified object", () => {
      const modified = { first: 1, second: 2 };
      const original = { first: 1, second: 1 };

      const changedValues = getModifiedProperties(modified, original);
      expect(changedValues).toEqual({ second: 2 });
    });

    it("returns modified complex properties between original and modified object", () => {
      const modified = {
        first: 1,
        second: { goodNums: [4, 5, 6], badNums: [1, 2, 3] },
      };
      const original = {
        first: 1,
        second: { goodNums: [4, 5, 6], badNums: [2, 2, 3] },
      };

      const changedValues = getModifiedProperties(modified, original);
      expect(changedValues).toEqual({
        second: { goodNums: [4, 5, 6], badNums: [1, 2, 3] },
      });
    });
  });
});
