import { csvJSON } from "../convertCSVtoJSON.js";
import * as fs from "fs";
import convertDateToTimestamp from "../mappings/convertDateToTimestamp.js";
import { processJson } from "../processJson.js";

describe("convert csv to json", function () {
  it("should csv to json", function () {
    const csv =
      "encounterNo,name\n123,testUserKOMMMAvladaKOMMMArameez";
    const expectedJson = [
      {
        encounterNo: "123",
        name: "testUser,vlada,rameez",
      },
    ];
    const json = csvJSON(csv);
    expect(json).toEqual(expectedJson);
  });

  it('should convert date to unix timestamp', function () {
    const date =
        "20-Aug-2023";
    const unixdate = convertDateToTimestamp(date);
    expect(unixdate).toEqual(1692529200);
  });

  it("should read and write external csv file", async function () {
    const path = process.cwd();
    var buffer = fs.readFileSync(path + "/src/__tests__/Encounter_csv.csv");
    const encounters = csvJSON(buffer.toString());
    encounters.map((encounter) => processJson(encounter));
    fs.writeFileSync(
      path + "/src/__tests__/ProcessedEncounter.json",
      JSON.stringify(encounters),
      function (err) {
        if (err) throw err;
        console.log("DONE!");
      }
    );
    expect(encounters.length).not.toEqual(0);
  });
});
