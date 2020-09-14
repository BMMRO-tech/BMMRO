import { getCurrentDate } from "./time";
import { format } from "date-fns";
import { TIME_FORMAT } from "../constants/forms";

const endEntry = (entry, options) => {
  if (entry.hasEnded) return entry;

  const timeFormat =
    options && options.endTimeFormat ? options.endTimeFormat : TIME_FORMAT;
  const realEndTimestamp = getCurrentDate();
  const endTimestampAtMidnight = new Date(realEndTimestamp);
  endTimestampAtMidnight.setHours(0, 0, 0, 0);
  const endTime = format(getCurrentDate(), timeFormat);

  let elapsedTime;
  if (entry.startTimestamp) {
    const elapsedMilliseconds = realEndTimestamp - entry.startTimestamp;
    elapsedTime = Math.round(elapsedMilliseconds / 60000);
  }

  return {
    ...entry,
    hasEnded: true,
    endTimestamp: endTimestampAtMidnight,
    endTime,
    elapsedTime: elapsedTime ? elapsedTime : "",
  };
};

export default endEntry;
