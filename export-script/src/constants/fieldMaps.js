const convertUnixTimestampToMDY = require("../mappings/convertUnixTimestampToMDY");
const convertWaveHeightOption = require("../mappings/convertWaveHeightOption");
const convertEmptyToNotNoted = require("../mappings/convertEmptyToNotNoted");
const convertToDecimal = require("../mappings/convertToDecimal");
const convertNotNotedToZero = require("../mappings/convertNotNotedToZero");
const convertNotNotedToNo = require("../mappings/convertNotNotedToNo");
const convertBeyondSoundingsTo9999 = require("../mappings/convertBeyondSoundingsTo9999");
const updateComment = require("../updateComment");
const convertSkinToBool = require("../mappings/convertSkinToBool");
const convertSkinAndBlubberToBool = require("../mappings/convertSkinAndBlubberToBool");
const convertAgeToInitial = require("../mappings/convertAgeToInitial");
const convertSexToInitials = require("../mappings/convertSexToInitials");
const convertHydrophoneCheck = require("../mappings/convertHydrophoneCheck");
const combineHydrophoneAndLogbookComments = require("../combineHydrophoneAndLogbookComments");
const convertBeyondSoundingsToMinusOne = require("../mappings/convertBeyondSoundingsToMinusOne");

module.exports = {
  encounter: {
    "Sequence #": { key: "sequenceNumber" },
    Date: { key: "startTimestamp", transform: convertUnixTimestampToMDY },
    Area: { key: "area" },
    "Encounter/Sighting": { key: "" },
    "Encounter #": { key: "encounterNumber" },
    "Sighting Number": { key: "" },
    Species: { key: "species", transform: convertEmptyToNotNoted },
    "Group size": { key: "numberOfAnimalsBest" },
    "No animals - Low": { key: "numberOfAnimalsLow" },
    "No animals - High": { key: "numberOfAnimalsHigh" },
    "Begin time": { key: "startTime" },
    Location: { key: "location" },
    Project: { key: "project", transform: convertEmptyToNotNoted },
    Vessel: { key: "vessel", transform: convertEmptyToNotNoted },
    Observers: { key: "observers" },
    "BMMRO data": { key: "" },
    Transect: { key: "transect" },
    "Transect #": { key: "transectNumber" },
    "Vessel log #": { key: "logbookNumber" },
    "Tape log #": { key: "" },
    "Video details": { key: "videoRec" },
    "Audio details": { key: "audioRec" },
    "Biopsy attempt": { key: "biopsyAttempt" },
    "Biopsy Success": {
      key: "biopsySuccess",
      transform: convertNotNotedToZero,
    },
    "Individual biopsied": { key: "" },
    "Biopsy sheet #": { key: "" },
    "Tag Attempt": { key: "tagAttempt" },
    "Tag Success": { key: "tagSuccess", transform: convertNotNotedToNo },
    Comments: { key: "comments" },
    "End of search effort": { key: "endOfSearchEffort" },
    "End time": { key: "endTime" },
    "Elapsed time": { key: "elapsedTime" },
    "# specimens": { key: "" },
    "Total samples": { key: "" },
    "GPS file name": { key: "" },
    "Total rolls": { key: "" },
    "Total # frames": { key: "" },
    "Total # of individuals ided": { key: "" },
    "Stranded?": { key: "" },
    "Visual IDs": { key: "visualIdentifications" },
    Cue: { key: "cue", transform: convertEmptyToNotNoted },
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
    "Reason for leaving": {
      key: "reasonForLeaving",
      transform: convertEmptyToNotNoted,
    },
    "Autec range": { key: "" },
    "Needs to be checked": { key: "needsToBeChecked" },
    "Entered By": { key: "enteredBy" },
    "High Tide": { key: "highTide" },
    "Low Tide": { key: "lowTide" },
    "Photographer-frame": { key: "photographerFrame" },
  },
  trip:{
    "Trip ID":{key:"tripId"},
    "GPS Filename":{key:"gpsFileName"},
    "Area":{key:"area"},
    "Vessel Name":{key:"vessel"},
    "Date": { key: "date", transform: convertUnixTimestampToMDY },
    "Time":{key:"time"},
    "Effort":{key:"efforted"},
    "Latitude":{key:"latitude"},
    "Longitude":{key:"longitude"},
    "# of Observers":{key:"numberOfObservers"},
    "Observers":{key:"observers"},
    "Engine hours":{key:"engineHoursMeterReading"},
    "Project":{key:"project"},
    "Water tempeature":{key:"waterTemp"},
    "Water depth":{key:"waterDepth", transform: convertBeyondSoundingsToMinusOne},
    "Bottom substrate":{key:"bottomSubstrate"},
    "Cloud cover":{key:"cloudCover"},
    "Beaufort scale":{key:"beaufortSeaState"},
    "Hydrophone check":{key:"hydrophoneChecked", transform: convertHydrophoneCheck},
    "Comments":{key:"gpsMark", transform: combineHydrophoneAndLogbookComments},
    "Logbook #":{key:""},
    "Wave Height":{key:"waveHeight", transform: convertWaveHeightOption},
    "Weather":{key:""},
    "Glare":{key:""},
    "Sightability":{key:""},
    "Wind Speed":{key:"windSpeed"},
    "Wind Direction":{key:"windDirection"},
  },
  habitatUse: {
    Date: { key: "date", transform: convertUnixTimestampToMDY },
    "Sequence #": { key: "encSeqNo" },
    Time: { key: "startTime" },
    Latitude: { key: "latitude" },
    Longitude: { key: "longitude" },
    "Water temperature": { key: "waterTemp" },
    "Water depth": {
      key: "waterDepth",
      transform: convertBeyondSoundingsTo9999,
    },
    "Bottom substrate": {
      key: "bottomSubstrate",
      transform: convertEmptyToNotNoted,
    },
    "Cloud cover": { key: "cloudCover", transform: convertEmptyToNotNoted },
    "Beaufort scale": {
      key: "beaufortSeaState",
    },
    "Tide state": { key: "tideState", transform: convertEmptyToNotNoted },
    Behaviour: { key: "behaviour", transform: convertEmptyToNotNoted },
    "Number of boats": { key: "numberOfBoats" },
    "Wave Height": {
      key: "swellWaveHeight",
      transform: convertWaveHeightOption,
    },
    DOT: { key: "directionOfTravel", transform: convertEmptyToNotNoted },
    "Surfacing Bout": { key: "surfaceBout", transform: convertToDecimal },
    "Bearing (relative )": { key: "bearing" },
    Distance: { key: "distance" },
    "Aspect (relative)": { key: "aspect" },
    "Group Cohesion": {
      key: "groupCohesion",
      transform: convertEmptyToNotNoted,
    },
    "End Time": { key: "endTime" },
    "Group Composition": { key: "groupComposition" },
    "# animals": { key: "numberOfAnimals" },
    Comment: {
      key: "gpsMark",
      transform: updateComment,
    },
    "Non-Tagged Surfacing Counts": { key: "" },
    "Tagged Whale?": { key: "" },
    "Tagged Surfacing Counts": { key: "" },
    Area: { key: "area" },
  },
  biopsy: {
    Area: { key: "area" },
    Date: { key: "dateTaken", transform: convertUnixTimestampToMDY },
    "Sequence #": { key: "encSeqNo" },
    Time: { key: "timeTaken" },
    Latitude: { key: "latitude" },
    Longitude: { key: "longitude" },
    "Attempt #": { key: "attempt" },
    "Sampler's name": { key: "samplerName" },
    "Sample #": { key: "sampleNumber" },
    "Total specimens": { key: "totalSpecimens" },
    "Area Hit": { key: "areaHit" },
    "Side Hit": { key: "whaleSide" },
    "Dart hit?": { key: "dartHit" },
    "Dart stuck?": { key: "dartStuck" },
    "Retrieved?": { key: "dartRetrieved" },
    "Skin sample?": { key: "sampleType", transform: convertSkinToBool },
    "Blub sample?": {
      key: "sampleType",
      transform: convertSkinAndBlubberToBool,
    },
    "Target Strength Reaction": {key: "reactionStrength"},
    "Non Target Reaction Extent": {key: "extent"},
    "Target Accelerated": {key: "targetAnimalBehaviour.accelerated"},
    "Target Shake": {key: "targetAnimalBehaviour.shake"},
    "Target Startle": {key: "targetAnimalBehaviour.startle"},
    "Target Tail Splash": {key: "targetAnimalBehaviour.tailSplash"},
    "Target Tail Slap": {key: "targetAnimalBehaviour.tailSlap"},
    "Target Lunge": {key: "targetAnimalBehaviour.lunge"},
    "Target Breach": {key: "targetAnimalBehaviour.breach"},
    "Target Dive": {key: "targetAnimalBehaviour.dive"},
    "Target Porpoising": {key: "targetAnimalBehaviour.porpoising"},
    "Target Flight": {key: "targetAnimalBehaviour.flight"},
    "Target Prolonged Flight": {key: "targetAnimalBehaviour.prolongedFlight"},
    "Target Direction Change": {key: "targetAnimalBehaviour.directionChange"},
    "NonTarget accelerated": {key: "nonTargetAnimalBehaviour.accelerated"},
    "NonTarget Shake": {key: "nonTargetAnimalBehaviour.shake"},
    "NonTarget Startle": {key: "nonTargetAnimalBehaviour.startle"},
    "NonTarget Tail Splash": {key: "nonTargetAnimalBehaviour.tailSplash"},
    "NonTarget Tail Slap": {key: "nonTargetAnimalBehaviour.tailSlap"},
    "NonTarget Lunge": {key: "nonTargetAnimalBehaviour.lunge"},
    "NonTarget Breach": {key: "nonTargetAnimalBehaviour.breach"},
    "NonTarget Dive": {key: "nonTargetAnimalBehaviour.dive"},
    "NonTarget Porpoising": {key: "nonTargetAnimalBehaviour.porpoising"},
    "NonTarget Flight": {key: "nonTargetAnimalBehaviour.flight"},
    "NonTarget Prolonged Flight": {key: "nonTargetAnimalBehaviour.prolongedFlight"},
    "NonTarget Direction Change": {key: "nonTargetAnimalBehaviour.directionChange"},
    "Whale ID": { key: "whaleID" },
    Sex: { key: "sex" },
    Age: { key: "age" },
    "Projector Type": { key: "projectorType"},
    "Projector Model": { key: "model"},
    "Tip dimensions (mm)": { key: "tipLength"},
    "Range (m)": { key: "range"},
    Angle: { key: "angle"},
    "Photographer a" : { key : "photographerInitials"},
    "Video details a" : {key: "video"},
    "Group behaviour before biopsy" : { key : "groupBehaviourBeforeBiopsy"},
    "Group behaviour after biopsy" : {key : "groupBehaviourAfterBiopsy"},
    "Other observations" : {key : "otherObservations"}
  },
  specimen: {
    Area: { key: "area" },
    Date: { key: "dateTaken", transform: convertUnixTimestampToMDY },
    Species: { key: "species" },
    "Sample #": { key: "sampleNumber" },
    "Sequence #": { key: "encSeqNo" },
    Latitude: { key: "latitude" },
    Longitude: { key: "longitude" },
    Time: { key: "timeTaken" },
    "Attempt #": { key: "attempt" },
    "Collection Type": { key: "collectionType" },
    "Specimen #": { key: "specimenNumber" },
    Type: { key: "sampleType" },
    Storage: { key: "storageType" },
    "Whale ID": { key: "whaleID" },
    Sex: { key: "sex", transform: convertSexToInitials },
    "Age Class": { key: "age", transform: convertAgeToInitial },
    "Other observations" : { key : "otherObservations"}
  },
  subCollectionToEncounter: {
    area: "area",
    encSeqNo: "sequenceNumber",
    date: "startTimestamp",
  },
  subCollectionToTrip: {
    area: "area",
    tripId: "tripId",
    vessel: "vessel",
    date: "date",
    gpsFileName: "gpsFileName",
    numberOfObservers: "numberOfObservers",
    observers: "observers",
    engineHoursMeterReading: "engineHoursMeterReading",
    project: "project",
    windDirection:"windDirection",
    windSpeed:"windSpeed"
  },
  biopsyToSpecimen: {
    species: "species",
    sampleNumber: "sampleNumber",
    encSeqNo: "encSeqNo",
    dateTaken: "dateTaken",
    latitude: "latitude",
    longitude: "longitude",
    area: "area",
    timeTaken: "timeTaken",
    attempt: "attempt",
    whaleID: "whaleID",
    sex: "sex",
    age: "age",
    otherObservations: "otherObservations"
  },
};
