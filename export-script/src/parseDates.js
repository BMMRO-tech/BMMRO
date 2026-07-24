import { parse, isValid } from "date-fns";
import getMessage from "./constants/getMessage.js";
import Status from "./helpers/Status.js";
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

export default parseArgs;
