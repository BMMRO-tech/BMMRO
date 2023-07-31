import { csvJSON } from "../convertCSVtoJSON.js";
import * as fs from "fs";
import convertDateToTimestamp from "../mappings/convertDateToTimestamp.js";
import { processJson } from "../processJson.js";
import transformSpecimen from "../transforms/transformSpecimen.js";
import * as inspector from "inspector";
import transformHabitat from "../transforms/transformHabitat.js";
import transformBiopsy from "../transforms/transformBiopsy.js";
import transformEncounter from "../transforms/transformEncounter.js";

const path = process.cwd();

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
    const buffer = fs.readFileSync(path + "/src/__tests__/Habitat_csv.csv");
    const encounters = csvJSON(buffer.toString());
    encounters.map((encounter) => processJson(encounter));
    fs.writeFileSync(
      path + "/src/__tests__/ProcessedHabitat.json",
      JSON.stringify(encounters),
      function (err) {
        if (err) throw err;
        console.log("DONE!");
      }
    );
    expect(encounters.length).not.toEqual(0);
  });

  it('should transform encounter specimen', function () {
    const buffer = fs.readFileSync(path + "/src/__tests__/ProcessedEncounterSpecimen.json").toString();
    const specimens = transformSpecimen(JSON.parse(buffer));
    fs.writeFileSync(
        path + "/src/__tests__/transformed/encounterSpecimen.json",
        JSON.stringify(specimens),
        function (err) {
          if (err) throw err;
          console.log("DONE!");
        }
    );
    expect(specimens.length).not.toEqual(0)
  });

  it('should transform habitat', function () {
    const buffer = fs.readFileSync(path + "/src/__tests__/ProcessedHabitat.json").toString();
    const habitats = transformHabitat(JSON.parse(buffer));
    fs.writeFileSync(
        path + "/src/__tests__/transformed/habitat.json",
        JSON.stringify(habitats),
        function (err) {
          if (err) throw err;
          console.log("DONE!");
        }
    );
    expect(habitats.length).not.toEqual(0)
  });

  it('should transform biopsy', function () {
    const buffer = fs.readFileSync(path + "/src/__tests__/ProcessedBiopsy.json").toString();
    const biopsies = transformBiopsy(JSON.parse(buffer));
    fs.writeFileSync(
        path + "/src/__tests__/transformed/biopsy.json",
        JSON.stringify(biopsies),
        function (err) {
          if (err) throw err;
          console.log("DONE!");
        }
    );
    expect(biopsies.length).not.toEqual(0)
  });

  it('should transform encounter', function () {
    const buffer = fs.readFileSync(path + "/src/__tests__/ProcessedEncounter.json").toString();
    const encounters = transformEncounter(JSON.parse(buffer));
    fs.writeFileSync(
        path + "/src/__tests__/transformed/encounter.json",
        JSON.stringify(encounters),
        function (err) {
          if (err) throw err;
          console.log("DONE!");
        }
    );
    expect(encounters.length).not.toEqual(0)
  });
});
