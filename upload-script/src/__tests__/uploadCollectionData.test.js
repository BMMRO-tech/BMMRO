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
            }
        ];
        uploadCollectionData(path, exportedJson);
        // expect(json).toEqual(expectedJson);
    });
});





