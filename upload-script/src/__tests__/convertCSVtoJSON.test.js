import {csvJSON} from "../convertCSVtoJSON.js";
import * as fs from "fs";


describe('convert csv to json', function () {
    it('should csv to json', function () {
        const csv = "encounterNo,date,name\n123,20Aug2023,testUserKOMMMAvlada";
        const expectedJson = [{
            encounterNo: "123",
            date: "20Aug2023",
            name: "testUser,vlada"
        }]
        const json = csvJSON(csv);
        expect(json).toEqual(expectedJson);
    });

    it('should read and write external csv file', async function () {

        const path = process.cwd();
        var buffer = fs.readFileSync(path + "/src/__tests__/Habitat_csv.csv");
        const json = csvJSON(buffer.toString());

        fs.writeFileSync( path + "/src/__tests__/Habitat.json", JSON.stringify(json), function(err) {
            if (err) throw err;
            console.log('DONE!');
        });
        expect(json.length).not.toEqual(0);
    });

});
