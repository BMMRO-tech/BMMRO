const { format, fromUnixTime } = require("date-fns");

const convertTimestampToMDY = (timestampObject) => {
  const finalFormat = "M/d/yyyy";

  const date = fromUnixTime(timestampObject.seconds);
  return format(date, finalFormat);
};

module.exports = convertTimestampToMDY;
