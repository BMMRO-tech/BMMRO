export const FormErrorType = {
  EMPTY: "empty",
  END_DATE_BEFORE_START_DATE: "end-date-before-start-date",
  END_TIME_BEFORE_START_TIME: "end-time-before-start-time",
  INVALID_DATE_FORMAT: "invalid-date-format",
  INVALID_END_DATE: "invalid-end-date",
  INVALID_END_TIME: "invalid-end-time",
  INVALID_NUMBER_FORMAT: "invalid-number-format",
  INVALID_POSITION_FORMAT: "invalid-position-format",
  INVALID_TIME_FORMAT: "invalid-time-format",
  MAX_DATE: "max-date",
  MAX_DECIMAL_PLACES: "max-decimal-places",
  MAX_TIME: "max-time",
  MAX_VALUE: "max-value",
  MIN_VALUE: "min-value",
};

export const FormSubmitType = {
  SAVE_AND_END: "save-and-end",
  SAVE: "save",
};

export const DATE_FORMAT = "dd/MM/yyyy";
export const TIME_FORMAT = "HH:mm";
export const TIME_WITH_SECONDS_FORMAT = "HH:mm:ss";
export const TIME_PATTERN = "^([0-1][0-9]|[2][0-3]):([0-5][0-9])$";
export const TIME_WITH_SECONDS_PATTERN =
  "^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$";
export const POSITION_DECIMAL_PRECISION = 6;
export const THREE_DAYS_IN_HOURS = 72;
