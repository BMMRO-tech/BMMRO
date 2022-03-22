import { Timestamp } from 'firebase/firestore/lite';

const getPreviousMonth = (currentDate) =>{
    currentDate.setDate(1);
    return new Date(currentDate.setMonth(currentDate.getMonth()-1));
};

const testTimestamp = Timestamp.fromDate(getPreviousMonth(new Date()));

export const encounterData = {
    area: "EA",
    enteredBy: "Research Assistant",
    exported: false,
    startTime:"10:56",
    startTimestamp: testTimestamp,
    hasEnded: true,
    sequenceNumber: "111",
    comments: "this is an e2e test",
    highTide: "",
    tagSuccess: "not-noted",
    audioRec: "",
    encounterNumber: "",
    lowTide: "",
    numSubAdultMale: "",
    biopsySuccess: "not-noted",
    project: "",
    visualIdentifications: "",
    numYoungOfYear: "",
    logbookNumber: "",
    numSubAdult: "",
    species: "Bottlenose dolphin - oceanic",
    location: "",
    needsToBeChecked: true,
    numAdultFemale: "",
    elapsedTime: "",
    numSubAdultFemale: "",
    numberOfAnimalsLow: "",
    numberOfAnimalsBest: "",
    numberOfAnimalsHigh: "",
    transect: "Off",
    numJuvenileFemale: "",
    endTimestamp: testTimestamp,
    endTime: "11:56",
    videoRec: "",
    numAdultMale: "",
    tagAttempt: "No",
    numNeonates: "",
    vessel: "",
    numUnknown: "",
    cue: "",
    reasonForLeaving: "",
    numJuvenileMale: "",
    observers: "",
    endOfSearchEffort: "",
    biopsyAttempt: "No",
    numAdultUnknown: "",
    photographerFrame: "",
    numJuvenileUnknown: "",
};