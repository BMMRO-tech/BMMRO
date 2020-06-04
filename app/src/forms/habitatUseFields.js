import { format } from "date-fns";
import {
  validateNumericField,
  validateDateField,
  validateTimeField,
  validateEmpty,
} from "./validation";
import { DATE_FORMAT, TIME_FORMAT } from "./constants";

const getCurrentDate = (dateFormat) => {
  return format(new Date(), dateFormat);
};

const getCurrentTime = (timeFormat) => {
  return format(new Date(), timeFormat);
};

export const fields = [
  {
    name: "numberOfAnimals",
    label: "No. of Animals",
    placeholder: "4",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 99),
  },
  {
    name: "numberOfCalves",
    label: "No. of Calves",
    placeholder: "4",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 99),
  },
  {
    name: "species",
    label: "Species",
    options: [
      "Bottlenose dolphin - coastal",
      "Gervais' beaked whale",
      "Bottlenose dolphin - oceanic",
      "Atlantic spotted dolphin",
      "Cuvier's beaked whale",
      "Blainville's beaked whale",
      "Dwarf sperm whale",
      "False killer whale",
      "Fraser's dolphin",
      "Humpback whale",
      "Killer whale",
      "Melon-headed whale",
      "Minke whale",
      "Northern bottlenose whale",
      "Pygmy killer whale",
      "Pygmy sperm whale",
      "Pan-tropical spotted dolphin",
      "Risso's dolphin",
      "Rough-toothed dolphin",
      "Short-finned pilot whale",
      "Sperm whale",
      "West Indian Manatee",
      "Clymene dolphin",
      "Striped dolphin",
      "Stenella sp.",
      "Unknown Mesoplodon species",
      "Unknown small cetacean",
      "Unknown large cetacean",
      "Unknown Kogia species",
      "Unknown Ziphiid species",
      "Fin Whale",
      "Unknown delphinid",
      "Hooded seal",
      "Unknown Pinniped",
      "Unknown medium cetacean",
      "Unknown cetacean",
      "Unknown balaenopterid",
    ],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "numberOfBoats",
    label: "No. of Boats",
    placeholder: "1",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 999),
  },
  {
    name: "directionOfTravel",
    label: "Direction of Travel",
    options: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "encSeqNo",
    label: "Enc Seq #",
    placeholder: "1",
    type: "number",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "comments",
    label: "Comments",
    placeholder: "Dolphins crater feeding",
    type: "textarea",
    required: false,
  },
  {
    name: "waterDepth",
    label: "Water Depth",
    placeholder: "1",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 9999),
  },
  {
    name: "waterTemp",
    label: "Water Temp",
    placeholder: "1",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 15, 40),
  },
  {
    name: "bottomSubstrate",
    label: "Bottom Substrate",
    options: [
      "Rock",
      "Rubble",
      "Coral",
      "Sand",
      "Silt/Mud",
      "Seagrass",
      "Unknown",
    ],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "cloudCover",
    label: "Cloud Cover",
    options: ["< 25%", "25% - 50%", "50% - 75%", "> 75%"],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "beaufortSeaState",
    label: "Beaufort Sea State",
    options: [0, 1, 2, 3, 4, 5],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "tideState",
    label: "Tide State",
    options: ["High", "Ebb", "Low", "Flood", "Slack"],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "behaviour",
    label: "Behaviour",
    options: ["Rest", "Feed", "Social", "Travel", "Milling"],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "swellWaveHeight",
    label: "Swell / Wave height (ft)",
    options: ["0", "1", "2", "3", "4", "5", "6+"],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "distance",
    label: "Distance",
    placeholder: "1",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 9999),
  },
  {
    name: "bearing",
    label: "Bearing",
    placeholder: "1",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 360),
  },
  {
    name: "aspect",
    label: "Aspect",
    placeholder: "1",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 360),
  },
  {
    name: "groupCohesion",
    label: "Group Cohesion",
    options: ["Tight", "Moderate", "Loose"],
    type: "select",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "groupComposition",
    label: "Group Composition",
    placeholder: "SM",
    type: "text",
    required: true,
    validate: (value) => validateEmpty(value),
  },
  {
    name: "surfaceBout",
    label: "Surface Bout",
    placeholder: "11",
    type: "number",
    required: true,
    validate: (value) => validateNumericField(value, 0, 99),
  },
  {
    name: "endTime",
    label: "End Time",
    placeholder: "12:00",
    type: "text",
    required: true,
    dependingOn: "date",
    validate: (value, dependingFieldValue) =>
      validateTimeField(value, dependingFieldValue, TIME_FORMAT, DATE_FORMAT),
  },
  {
    name: "date",
    label: "Date",
    placeholder: "dd/mm/yyyy",
    type: "text",
    required: true,
    initialValue: () => getCurrentDate(DATE_FORMAT),
    validate: (value) => validateDateField(value, DATE_FORMAT),
  },
  {
    name: "startTime",
    label: "Start Time",
    placeholder: "12:00",
    type: "text",
    required: true,
    dependingOn: "date",
    initialValue: () => getCurrentTime(TIME_FORMAT),
    validate: (value, dependingFieldValue) =>
      validateTimeField(value, dependingFieldValue, TIME_FORMAT, DATE_FORMAT),
  },
  {
    name: "latitude",
    label: "Lat",
    placeholder: "53.012",
    type: "text",
    required: true,
    validate: (value) => validateNumericField(value, -90, 90),
  },
  {
    name: "longitude",
    label: "Long",
    placeholder: "-68.356",
    type: "text",
    required: true,
    validate: (value) => validateNumericField(value, -180, 180),
  },
];
