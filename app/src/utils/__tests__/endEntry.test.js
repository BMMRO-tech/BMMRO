import endEntry from "../endEntry";
import { TIME_WITH_SECONDS_FORMAT } from "../../constants/forms";
import * as time from "../time";

describe("endEntry", () => {
  beforeEach(() => {
    jest
      .spyOn(time, "getCurrentDate")
      .mockReturnValue(new Date("2010-06-07T12:34:56.000"));
  });

  it("flips the hasEnded property to true", () => {
    const input = { a: 1, b: 2 };

    const output = endEntry(input);

    expect(output.hasEnded).toBe(true);
  });

  it("adds an endTimestamp with time at midnight", () => {
    const input = { a: 1, b: 2 };

    const output = endEntry(input);

    expect(output.endTimestamp).toEqual(new Date(Date.parse("2010/06/07")));
    expect(output.endTimestamp.getHours()).toEqual(0);
    expect(output.endTimestamp.getMinutes()).toEqual(0);
    expect(output.endTimestamp.getSeconds()).toEqual(0);
    expect(output.endTimestamp.getMilliseconds()).toEqual(0);
  });

  it("adds an endTime in standard hours:minutes format", () => {
    const input = { a: 1, b: 2 };

    const output = endEntry(input);

    expect(output.endTime).toEqual("12:34");
  });

  it("lets you configure endTime format through options", () => {
    const input = { a: 1, b: 2 };
    const options = { endTimeFormat: TIME_WITH_SECONDS_FORMAT };

    const output = endEntry(input, options);

    expect(output.endTime).toEqual("12:34:56");
  });

  it("calculates the elapsed time relative to startTime", () => {
    const startTimestamp = new Date(Date.parse("2010/06/07"));
    startTimestamp.setHours(12, 20, 27);
    const input = {
      a: 1,
      b: 2,
      startTimestamp,
    };

    const output = endEntry(input);

    expect(output.elapsedTime).toEqual(14);
  });

  it("doesn't end the entry if hasEnded is already true", () => {
    const input = { a: 1, b: 2, hasEnded: true };

    const output = endEntry(input);

    expect(output.elapsedTime).not.toBeDefined();
    expect(output.endTime).not.toBeDefined();
    expect(output.endTimestamp).not.toBeDefined();
  });

  it("doesn't override elapsedTime if startTimestamp is not defined", () => {
    const input = { a: 1, b: 2, elapsedTime: "🥭" };

    const output = endEntry(input);

    expect(output.elapsedTime).toEqual("🥭");
  });

  it("doesn't override endTime, endTimestamp or elapsedTime if provided", () => {
    const input = {
      a: 1,
      b: 2,
      endTime: "🥭",
      endTimestamp: "🍅",
      elapsedTime: "🍆",
    };

    const output = endEntry(input);

    expect(output.hasEnded).toBe(true);
    expect(output.endTime).toEqual("🥭");
    expect(output.endTimestamp).toEqual("🍅");
    expect(output.elapsedTime).toEqual("🍆");
  });
});
