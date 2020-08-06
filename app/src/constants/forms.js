export const FormErrorType = {
  EMPTY: "empty",
  MIN_VALUE: "min-value",
  MAX_VALUE: "max-value",
  INVALID_NUMBER_FORMAT: "invalid-number-format",
  MAX_DATE: "max-date",
  INVALID_DATE_FORMAT: "invalid-date-format",
  MAX_TIME: "max-time",
  INVALID_TIME_FORMAT: "invalid-time-format",
  START_TIME_AFTER_END_TIME: "start-time-after-end-time",
  TIME_IN_FUTURE: "time-in-future",
  INVALID_POSITION_FORMAT: "invalid-position-format",
};

export const DATE_FORMAT = "dd/MM/yyyy";
export const TIME_FORMAT = "HH:mm";
export const TIME_PATTERN = "^([0-1][0-9]|[2][0-3]):([0-5][0-9])$";
export const POSITION_DECIMAL_PRECISION = 6;
