import {uploadCollectionData} from "../uploadCollectionData.js";
import * as fs from "fs";

describe("upload a collection to Firestore", function () {
    it("should upload a dummy JSON to Firestore", function () {
        const path = "encounter";
        const exportedJson = [
            {
                encounterNo: "123",
                date: "20-Aug-2023",
                startTime: "05:06",
                area: "Soho, Central London",
                biopsyAttempt: "No",
                sequenceNumber: "E013"
            },
        ];
        uploadCollectionData(path, exportedJson);
        // expect(json).toEqual(expectedJson);
    });
});





