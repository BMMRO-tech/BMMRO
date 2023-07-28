import { csvJSON } from "../convertCSVtoJSON.js";
import * as fs from "fs";
import { processJson } from "../processJson.js";

describe("convert csv to json", function () {
  it("should csv to json", function () {
    const csv =
      "encounterNo,date,name\n123,20Aug2023,testUserKOMMMAvladaKOMMMArameez";
    const expectedJson = [
      {
        encounterNo: "123",
        date: "20Aug2023",
        name: "testUser,vlada,rameez",
      },
    ];
    const json = csvJSON(csv);
    expect(json).toEqual(expectedJson);
  });

  it("should read and write external csv file", async function () {
    const path = process.cwd();
    var buffer = fs.readFileSync(path + "/src/__tests__/Biopsy_csv.csv");
    const encounters = csvJSON(buffer.toString());
    //encounters.map((encounter) => processJson(encounter));
    fs.writeFileSync(
      path + "/src/__tests__/ProcessedBiopsy.json",
      JSON.stringify(encounters),
      function (err) {
        if (err) throw err;
        console.log("DONE!");
      }
    );
    expect(encounters.length).not.toEqual(0);
  });
});
