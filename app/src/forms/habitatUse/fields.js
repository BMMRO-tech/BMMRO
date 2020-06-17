import { format } from "date-fns";
import {
  validateNumericField,
  validateDateField,
  validateStartTimeField,
  validateEndTimeField,
  validateEmpty,
  validatePositionField,
  validateMaxCharLength,
  validateTextField,
} from "../validation";
import {
  DATE_FORMAT,
  TIME_FORMAT,
  POSITION_DECIMAL_PRECISION,
} from "../../constants/forms";

const getCurrentDate = () => {
  return format(new Date(Date.now()), DATE_FORMAT);
};

const getCurrentTime = () => {
  return format(new Date(Date.now()), TIME_FORMAT);
};

export const fields = [
  {
    name: "numberOfAnimals",
    label: "No. of Animals",
    placeholder: "4",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 99),
  },
  {
    name: "numberOfCalves",
    label: "No. of Calves",
    placeholder: "4",
    type: "number",
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
    validate: (value) => validateEmpty(value),
  },
  {
    name: "numberOfBoats",
    label: "No. of Boats",
    placeholder: "1",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 999),
  },
  {
    name: "directionOfTravel",
    label: "Direction of Travel",
    options: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    type: "select",
    validate: (value) => validateEmpty(value),
  },
  {
    name: "encSeqNo",
    label: "Enc Seq #",
    placeholder: "1",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 99),
  },
  {
    name: "comments",
    label: "Comments",
    placeholder: "Dolphins crater feeding",
    type: "textarea",
    validate: (value) => validateMaxCharLength(value, 500),
  },
  {
    name: "waterDepth",
    label: "Water Depth (m)",
    placeholder: "1",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 9999),
  },
  {
    name: "waterTemp",
    label: "Water Temp (°C)",
    placeholder: "1",
    type: "number",
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
    validate: (value) => validateEmpty(value),
  },
  {
    name: "cloudCover",
    label: "Cloud Cover",
    options: ["< 25%", "25% - 50%", "50% - 75%", "> 75%"],
    type: "select",
    validate: (value) => validateEmpty(value),
  },
  {
    name: "beaufortSeaState",
    label: "Beaufort Sea State",
    options: [0, 1, 2, 3, 4, 5],
    type: "select",
    validate: (value) => validateEmpty(value),
  },
  {
    name: "tideState",
    label: "Tide State",
    options: ["High", "Ebb", "Low", "Flood", "Slack"],
    type: "select",
    validate: (value) => validateEmpty(value),
  },
  {
    name: "behaviour",
    label: "Behaviour",
    options: ["Rest", "Feed", "Social", "Travel", "Milling"],
    type: "select",
    validate: (value) => validateEmpty(value),
  },
  {
    name: "swellWaveHeight",
    label: "Swell / Wave height (ft)",
    options: ["0", "1", "2", "3", "4", "5", "6+"],
    type: "select",
    validate: (value) => validateEmpty(value),
  },
  {
    name: "distance",
    label: "Distance (m)",
    placeholder: "1",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 9999),
  },
  {
    name: "bearing",
    label: "Bearing (°)",
    placeholder: "1",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 360),
  },
  {
    name: "aspect",
    label: "Aspect (°)",
    placeholder: "1",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 360),
  },
  {
    name: "groupCohesion",
    label: "Group Cohesion",
    options: ["Tight", "Moderate", "Loose"],
    type: "select",
    validate: (value) => validateEmpty(value),
  },
  {
    name: "groupComposition",
    label: "Group Composition",
    placeholder: "SM",
    type: "text",
    validate: (value) => validateTextField(value, 100),
  },
  {
    name: "surfaceBout",
    label: "Surface Bout",
    placeholder: "11",
    type: "number",
    validate: (value) => validateNumericField(value, 0, 99),
  },
  {
    name: "endTime",
    label: "End Time (hh:mm)",
    placeholder: "16:00",
    type: "text",
    dependingOn: ["date", "startTime"],
    validate: (value, dependingFields) =>
      validateEndTimeField(value, dependingFields),
  },
  {
    name: "date",
    label: "Date (dd/mm/yyyy)",
    placeholder: "23/05/2020",
    type: "text",
    initialValue: () => getCurrentDate(),
    validate: (value) => validateDateField(value),
  },
  {
    name: "startTime",
    label: "Start Time (hh:mm)",
    placeholder: "15:00",
    type: "text",
    dependingOn: ["date"],
    initialValue: () => getCurrentTime(),
    validate: (value, dependingFields) =>
      validateStartTimeField(value, dependingFields),
  },
  {
    name: "latitude",
    label: "Lat",
    placeholder: "53.012234",
    type: "text",
    validate: (value) =>
      validatePositionField(value, -90, 90, POSITION_DECIMAL_PRECISION),
  },
  {
    name: "longitude",
    label: "Long",
    placeholder: "-68.356234",
    type: "text",
    validate: (value) =>
      validatePositionField(value, -180, 180, POSITION_DECIMAL_PRECISION),
  },
];