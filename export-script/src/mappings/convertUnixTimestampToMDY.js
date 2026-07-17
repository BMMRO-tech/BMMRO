import { format, fromUnixTime } from "date-fns";

const convertTimestampToMDY = (timestampObject) => {
  const finalFormat = "M/d/yyyy";

  const date = fromUnixTime(timestampObject.seconds);
  return format(date, finalFormat);
};

export default convertTimestampToMDY;
