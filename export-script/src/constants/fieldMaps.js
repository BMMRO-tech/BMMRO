const convertUnixTimestampToMDY = require("../convertUnixTimestampToMDY");
const prependFromFirestore = require("../prependFromFirestore");

module.exports = {
  encounter: {
    "Sequence #": { key: "sequenceNumber" },
    Date: { key: "startTimestamp", transform: convertUnixTimestampToMDY },
    Area: { key: "area" },
    "Encounter/Sighting": { key: "" },
    "Encounter #": { key: "" },
    "Sighting Number": { key: "" },
    Species: { key: "species" },
    "Group size": { key: "groupSize" },
    "Begin time": { key: "" },
    Location: { key: "location" },
    Project: { key: "project" },
    Vessel: { key: "vessel" },
    Observers: { key: "observers" },
    "BMMRO data": { key: "" },
    Transect: { key: "transect" },
    "Transect #": { key: "transectNumber" },
    "Vessel log #": { key: "" },
    "Tape log #": { key: "" },
    "Video details": { key: "videoRec" },
    "Audio details": { key: "audioRec" },
    "Biopsy attempt": { key: "biopsyAttempt" },
    "Biopsy Success": { key: "biopsySuccess" },
    "Individual biopsied": { key: "" },
    "Biopsy sheet #": { key: "" },
    "Tag Attempt": { key: "tagAttempt" },
    "Tag Success": { key: "tagSuccess" },
    Comments: { key: "comments", transform: prependFromFirestore },
    "End of search effort": { key: "" },
    "End time": { key: "" },
    "Elapsed time": { key: "" },
    "# specimens": { key: "" },
    "Total samples": { key: "" },
    "GPS file name": { key: "" },
    "Total rolls": { key: "" },
    "Total # frames": { key: "" },
    "Total # of individuals ided": { key: "" },
    "Stranded?": { key: "" },
    "Visual IDs": { key: "visualIdentifications" },
    Cue: { key: "cue" },
    "# Adult Male": { key: "numAdultMale" },
    "# Adult Female": { key: "numAdultFemale" },
    "# Adult Unknown": { key: "numAdultUnknown" },
    "# Subadult Male": { key: "numSubAdultMale" },
    "# Subadult Female": { key: "numSubAdultFemale" },
    "# Subadult Unknown": { key: "numSubAdult" },
    "# Juvenile Male": { key: "numJuvenileMale" },
    "# Juvenile Female": { key: "numJuvenileFemale" },
    "# Juvenile Unknown": { key: "numJuvenileUnknown" },
    "# Year of Young": { key: "numYoungOfYear" },
    "# Neonate": { key: "numNeonates" },
    "# Unknown": { key: "numUnknown" },
    "Reason for leaving": { key: "" },
    "Autec range": { key: "" },
  },
  habitatUse: {
    Date: { key: "date", transform: convertUnixTimestampToMDY },
    "Sequence #": { key: "encSeqNo" },
    Time: { key: "startTime" },
    Latitude: { key: "latitude" },
    Longitude: { key: "longitude" },
    "Water temperature": { key: "waterTemp" },
    "Water depth": { key: "waterDepth" },
    "Bottom substrate": { key: "bottomSubstrate" },
    "Cloud cover": { key: "cloudCover" },
    "Beaufort scale": { key: "beaufortSeaState" },
    "Tide state": { key: "tideState" },
    Behaviour: { key: "behaviour" },
    "Number of boats": { key: "numberOfBoats" },
    "Wave Height": { key: "swellWaveHeight" },
    DOT: { key: "directionOfTravel" },
    "Surfacing Bout": { key: "surfaceBout" },
    "Bearing (relative )": { key: "bearing" },
    Distance: { key: "distance" },
    "Aspect (relative)": { key: "aspect" },
    "Group Cohesion": { key: "groupCohesion" },
    "End Time": { key: "endTime" },
    "Group Composition": { key: "groupComposition" },
    "# animals": { key: "numberOfAnimals" },
    Comment: {
      key: "comments",
      transform: prependFromFirestore,
    },
    "Non-Tagged Surfacing Counts": { key: "" },
    "Tagged Whale?": { key: "" },
    "Tagged Surfacing Counts": { key: "" },
    Area: { key: "area" },
  },
  habitatUseToEncounter: {
    area: "area",
    encSeqNo: "sequenceNumber",
    date: "startTimestamp",
  },
};
