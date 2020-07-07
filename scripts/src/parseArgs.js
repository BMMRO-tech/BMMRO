const { parse, isValid } = require("date-fns");
const errorTypes = require("./constants/messages");
const Status = require("./helpers/Status");
const DATE_FORMAT = "dd/MM/yyyy";

const parseArgs = (args) => {
  if (!args[2] || !args[3]) {
    return new Status("MISSING_ARG", errorTypes.MISSING_ARG);
  }

  const startDate = parse(args[2], DATE_FORMAT, new Date());
  const endDate = parse(args[3], DATE_FORMAT, new Date());

  if (!isValid(startDate) || !isValid(endDate)) {
    return new Status("INVALID_DATE_FORMAT", errorTypes.INVALID_DATE_FORMAT);
  }

  if (startDate > endDate) {
    return new Status(
      "END_DATE_BEFORE_START_DATE",
      errorTypes.END_DATE_BEFORE_START_DATE
    );
  }

  return new Status("SUCCESS", { startDate, endDate });
};

module.exports = parseArgs;
