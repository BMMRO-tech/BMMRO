const { parse, isValid } = require("date-fns");
const getMessage = require("./constants/getMessage");
const Status = require("./helpers/Status");
const DATE_FORMAT = "dd/MM/yyyy";

const parseArgs = (startDateArg, endDateArg) => {
  if (!startDateArg || !endDateArg) {
    return new Status("MISSING_ARG", getMessage("MISSING_ARG"));
  }

  const startDate = parse(startDateArg, DATE_FORMAT, new Date());
  const endDate = parse(endDateArg, DATE_FORMAT, new Date());

  if (!isValid(startDate) || !isValid(endDate)) {
    return new Status("INVALID_DATE_FORMAT", getMessage("INVALID_DATE_FORMAT"));
  }

  if (startDate > endDate) {
    return new Status(
      "END_DATE_BEFORE_START_DATE",
      getMessage("END_DATE_BEFORE_START_DATE")
    );
  }

  return new Status("SUCCESS", { startDate, endDate });
};

module.exports = parseArgs;
