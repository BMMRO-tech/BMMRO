import uploadCollectionData from "../uploadCollectionData.js";

describe("upload a collection to Firestore", function () {
    it("should upload a dummy JSON to Firestore", function () {
        const path = "/encounter";
        const exportedJson = [
            {
                encounterNumber: "10000000",
                startTimestamp: new Date(1655722800),
                area: "Soho, Central London",
                biopsyAttempt: "No",
                sequenceNumber: "E13"
            },
            {
                encounterNumber: "05060708",
                date: "13-May-2023",
                startTime: "05:06",
                area: "Barbican, East-ish London",
                biopsyAttempt: "Thwarted",
                sequenceNumber: "E24"
            },
        ];
        uploadCollectionData(path, exportedJson);
        // expect(json).toEqual(expectedJson);
    });
});

    it("should upload a valid JSON to Firestore", function () {
        const path = process.cwd();
        const buffer = fs.readFileSync(path + "/src/__tests__/Encounter_test.json");
        const data = buffer.toString();
        console.log(data);
        const collection  = "/encounter";
        const exportedJson = JSON.parse(data);
        uploadCollectionData(collection, exportedJson);
    });
});
