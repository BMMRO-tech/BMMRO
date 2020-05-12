const isoDateToday = () => {
  return new Date().toISOString().split("T")[0];
};

export const fields = [
  {
    name: "date",
    label: "Date",
    placeholder: "mm/dd/yyyy",
    type: "date",
    required: true,
    initialValue: () => {
      return isoDateToday();
    },
  },
  {
    name: "encSeqNo",
    label: "Enc Seq #",
    placeholder: "1",
    type: "number",
    required: true,
  },
  {
    name: "species",
    label: "Species",
    placeholder: "whale",
    type: "text",
    required: true,
  },
  {
    name: "time",
    label: "Time",
    placeholder: "12:00",
    type: "time",
    required: true,
    initialValue: () => {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    name: "latitude",
    label: "Lat",
    placeholder: "lat",
    type: "text",
    required: true,
  },
  {
    name: "longitude",
    label: "Long",
    placeholder: "long",
    type: "text",
    required: true,
  },
  {
    name: "waterDepth",
    label: "Water Depth",
    placeholder: "1",
    type: "number",
    required: true,
  },
  {
    name: "waterTemp",
    label: "Water Temp",
    placeholder: "1",
    type: "number",
    required: true,
  },
  {
    name: "bottomSubstrate",
    label: "Bottom Substrate",
    options: [
      "ROCK",
      "RUBBLE",
      "CORAL",
      "SAND",
      "SILT/MUD",
      "SEAGRASS",
      "UNKNOWN",
    ],
    type: "select",
    required: true,
  },
  {
    name: "cloudCover",
    label: "Cloud Cover",
    options: ["< 25%", "25% - 50%", "50% - 75%", "> 75%"],
    type: "select",
    required: true,
  },
  {
    name: "beaufortSeaState",
    label: "Beaufort Sea State",
    options: [0, 1, 2, 3, 4, 5],
    type: "select",
    required: true,
  },
  {
    name: "tideState",
    label: "Tide State",
    options: ["HIGH", "EBB", "LOW", "FLOOD", "SLACK"],
    type: "select",
    required: true,
  },
  {
    name: "behaviour",
    label: "Behaviour",
    options: ["REST", "FEED", "SOCIAL", "TRAVEL", "MILLING"],
    type: "select",
    required: true,
  },
  {
    name: "swellWaveHeight",
    label: "Swell / Wave height (ft)",
    options: ["0", "1", "2", "3", "4", "5", "6+"],
    type: "select",
    required: true,
  },
  {
    name: "directionOfTravel",
    label: "Direction of Travel (heading degrees)",
    placeholder: "0-360",
    type: "number",
    required: true,
  },
  {
    name: "numberOfBoats",
    label: "No. of Boats",
    placeholder: "1",
    type: "number",
    required: true,
  },
];
