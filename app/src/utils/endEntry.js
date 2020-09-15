import { getCurrentDate } from "./time";
import { format } from "date-fns";
import { TIME_FORMAT } from "../constants/forms";

const endEntry = (entry, options) => {
  if (entry.hasEnded) return entry;

  const modifiedProperties = {};

  const timeFormat =
    options && options.endTimeFormat ? options.endTimeFormat : TIME_FORMAT;
  const realEndTimestamp = getCurrentDate();
  const endTimestampAtMidnight = new Date(realEndTimestamp);
  endTimestampAtMidnight.setHours(0, 0, 0, 0);
  const endTime = format(getCurrentDate(), timeFormat);

  modifiedProperties.hasEnded = true;
  if (!entry.endTimestamp)
    modifiedProperties.endTimestamp = endTimestampAtMidnight;
  if (!entry.endTime) modifiedProperties.endTime = endTime;
  if (!entry.elapsedTime && entry.startTimestamp) {
    const elapsedMilliseconds = realEndTimestamp - entry.startTimestamp;
    const elapsedTime = Math.round(elapsedMilliseconds / 60000);
    modifiedProperties.elapsedTime = elapsedTime;
  }

  return {
    ...entry,
    ...modifiedProperties,
  };
};

export default endEntry;
