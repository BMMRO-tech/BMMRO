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
    Transect: { key: "" },
    "Transect #": { key: "" },
    "Vessel log #": { key: "" },
    "Tape log #": { key: "" },
    "Video details": { key: "videoRec" },
    "Audio details": { key: "audioRec" },
    "Biopsy attempt": { key: "" },
    "Biopsy Success": { key: "" },
    "Individual biopsied": { key: "" },
    "Biopsy sheet #": { key: "" },
    "Tag Attempt": { key: "" },
    "Tag Success": { key: "" },
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
    "Visual IDs": { key: "" },
    Cue: { key: "cue" },
    "# Adult Male": { key: "" },
    "# Adult Female": { key: "" },
    "# Adult Unknown": { key: "" },
    "# Subadult Male": { key: "" },
    "# Subadult Female": { key: "" },
    "# Subadult Unknown": { key: "" },
    "# Juvenile Male": { key: "" },
    "# Juvenile Female": { key: "" },
    "# Juvenile Unknown": { key: "" },
    "# Year of Young": { key: "" },
    "# Neonate": { key: "" },
    "# Unknown": { key: "" },
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
