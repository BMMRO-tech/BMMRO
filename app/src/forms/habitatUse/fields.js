import { format } from "date-fns";
import {
  validateFloatField,
  validateIntegerField,
  validateStartTimeField,
  validateEndTimeField,
  validatePositionField,
  validateMaxCharLength,
  validateTextField,
} from "../validation";
import { TIME_FORMAT, POSITION_DECIMAL_PRECISION } from "../../constants/forms";

const getCurrentDate = () => new Date(Date.now());

const formatTime = (date) => format(date, TIME_FORMAT);

export const fields = [
  {
    name: "numberOfAnimals",
    label: "Number of Animals",
    type: "number",
    validate: (value) => validateIntegerField(value, 0, 99),
    initialValue: () => 1,
  },
  {
    name: "numberOfCalves",
    label: "Number of Calves",
    type: "number",
    validate: (value) => validateIntegerField(value, 0, 99),
  },
  {
    name: "numberOfBoats",
    label: "Number of Boats",
    type: "number",
    validate: (value) => validateIntegerField(value, 0, 999),
    initialValue: () => 1,
  },
  {
    name: "directionOfTravel",
    label: "Direction of Travel",
    options: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    type: "select",
  },
  {
    name: "comments",
    label: "Comments",
    type: "textarea",
    validate: (value) => validateMaxCharLength(value, 500),
  },
  {
    name: "waterDepth",
    label: "Water Depth (m)",
    type: "number",
    validate: (value) => validateFloatField(value, 0, 9999),
  },
  {
    name: "waterTemp",
    label: "Water Temp (°C)",
    type: "number",
    validate: (value) => validateFloatField(value, 15, 40),
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
  },
  {
    name: "cloudCover",
    label: "Cloud Cover",
    options: ["< 25%", "25% - 50%", "50% - 75%", "> 75%"],
    type: "select",
  },
  {
    name: "beaufortSeaState",
    label: "Beaufort Sea State",
    options: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    type: "select",
  },
  {
    name: "tideState",
    label: "Tide State",
    options: ["High", "Ebb", "Low", "Flood", "Slack"],
    type: "select",
  },
  {
    name: "behaviour",
    label: "Behaviour",
    options: ["Rest", "Feed", "Social", "Travel", "Milling"],
    type: "select",
  },
  {
    name: "swellWaveHeight",
    label: "Swell / Wave height (ft)",
    options: ["0", "1", "2", "3", "4", "5", "6+"],
    type: "select",
  },
  {
    name: "distance",
    label: "Distance (m)",
    type: "number",
    validate: (value) => validateFloatField(value, 0, 9999),
  },
  {
    name: "bearing",
    label: "Bearing (°)",
    type: "number",
    validate: (value) => validateFloatField(value, 0, 360),
  },
  {
    name: "aspect",
    label: "Aspect (°)",
    type: "number",
    validate: (value) => validateFloatField(value, 0, 360),
  },
  {
    name: "groupCohesion",
    label: "Group Cohesion",
    options: ["Tight", "Moderate", "Loose"],
    type: "select",
  },
  {
    name: "groupComposition",
    label: "Group Composition",
    type: "text",
    validate: (value) => validateTextField(value, 100),
  },
  {
    name: "surfaceBout",
    label: "Surface Bout",
    type: "number",
    validate: (value) => validateIntegerField(value, 0, 99),
    initialValue: () => 0,
  },
  {
    name: "endTime",
    label: "End Time (hh:mm)",
    type: "text",
    dependingOn: ["date", "startTime"],
    validate: (value, dependingFields) =>
      validateEndTimeField(value, dependingFields),
  },
  {
    name: "startTime",
    label: "Start Time (hh:mm)*",
    type: "text",
    dependingOn: ["date"],
    initialValue: () => formatTime(getCurrentDate()),
    validate: (value, dependingFields) =>
      validateStartTimeField(value, dependingFields),
  },
  {
    name: "latitude",
    label: "Lat*",
    type: "text",
    validate: (value) =>
      validatePositionField(value, -90, 90, POSITION_DECIMAL_PRECISION),
  },
  {
    name: "longitude",
    label: "Long*",
    type: "text",
    validate: (value) =>
      validatePositionField(value, -180, 180, POSITION_DECIMAL_PRECISION),
  },
  {
    name: "timestamp",
    type: "hidden",
    initialValue: () => getCurrentDate(),
  },
];
