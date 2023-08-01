import uploadCollectionData from "../uploadCollectionData.js";
import * as fs from "fs";

describe("upload a collection to Firestore", function () {
  it("should upload a dummy JSON to Firestore", function () {
    const path = "/encounter";
    const exportedJson = [
      {
        encounterNumber: "10000000",
        startTimestamp: new Date(1655722800),
        area: "Soho, Central London",
        biopsyAttempt: "No",
        sequenceNumber: "E13",
      },
      {
        encounterNumber: "05060708",
        date: "13-May-2023",
        startTime: "05:06",
        area: "Barbican, East-ish London",
        biopsyAttempt: "Thwarted",
        sequenceNumber: "E24",
      },
    ];
    uploadCollectionData(path, exportedJson);
  });

  it("should upload a valid JSON to Firestore", function () {
    uploadCollectionData();
  });
});
