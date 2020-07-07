const { parse, format } = require("date-fns");

const convertDateToMDY = (dmyDate) => {
  // https://date-fns.org/v2.14.0/docs/format
  const originalFormat = "dd/MM/yyyy";
  const finalFormat = "M/d/yyyy";

  const date = parse(dmyDate, originalFormat, new Date());
  return format(date, finalFormat);
};

module.exports = convertDateToMDY;
