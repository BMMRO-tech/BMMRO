import { parse, isValid } from "date-fns";
import { FormErrorType, DATE_FORMAT, TIME_FORMAT } from "./constants";

export const validateEmpty = (value) => {
  if (value !== 0 && !value) return { type: FormErrorType.EMPTY };
};

const validateMax = (value, max) => {
  if (value > max)
    return {
      type: FormErrorType.MAX_VALUE,
      rule: max,
    };
};

const validateMin = (value, min) => {
  if (value < min) {
    return {
      type: FormErrorType.MIN_VALUE,
      rule: min,
    };
  }
};

export const validateMaxCharLength = (value, max) => {
  if (value.length > max) {
    return {
      type: FormErrorType.MAX_CHAR_LENGTH,
      rule: max,
    };
  }
};

const validateDecimalPrecision = (value, precision) => {
  const decimalDigits = (value.toString().split(".")[1] || []).length;

  if (decimalDigits > precision || decimalDigits < precision) {
    return {
      type: FormErrorType.INVALID_POSITION_FORMAT,
      rule: precision,
    };
  }
};

const validateDateFormat = (value) => {
  const date = parse(value, DATE_FORMAT, new Date());

  if (!isValid(date)) {
    return {
      type: FormErrorType.INVALID_DATE_FORMAT,
      rule: DATE_FORMAT,
    };
  }
};

const validateDateMax = (value, max = new Date(Date.now())) => {
  const parsedDate = parse(value, DATE_FORMAT, new Date());

  if (parsedDate > max) {
    return {
      type: FormErrorType.MAX_DATE,
    };
  }
};

const validateTimeFormat = (value) => {
  const time = parse(value, TIME_FORMAT, new Date());

  if (!isValid(time)) {
    return {
      type: FormErrorType.INVALID_TIME_FORMAT,
      rule: TIME_FORMAT,
    };
  }
};

const validateTimeMax = (time, date, max = new Date(Date.now())) => {
  const dateWithTime = `${date} ${time}`;
  const fromatDateWithTime = `${DATE_FORMAT} ${TIME_FORMAT}`;
  const parsedDateWithTime = parse(
    dateWithTime,
    fromatDateWithTime,
    new Date()
  );

  if (parsedDateWithTime > max) {
    return {
      type: FormErrorType.MAX_TIME,
    };
  }
};

const validateStartTimeBeforeEndTime = (startTime, endTime) => {
  const startTimeParsed = parse(startTime, TIME_FORMAT, new Date());
  const endTimeParsed = parse(endTime, TIME_FORMAT, new Date());

  if (startTimeParsed > endTimeParsed) {
    return {
      type: FormErrorType.START_TIME_AFTER_END_TIME,
    };
  }
};

export const validateNumericField = (value, min, max) => {
  return (
    validateEmpty(value) || validateMin(value, min) || validateMax(value, max)
  );
};

export const validateDateField = (value) => {
  return (
    validateEmpty(value) || validateDateFormat(value) || validateDateMax(value)
  );
};

export const validateTextField = (value, max) => {
  return validateEmpty(value) || validateMaxCharLength(value, max);
};

export const validateStartTimeField = (time, dependingFields) => {
  return (
    validateEmpty(time) ||
    validateTimeFormat(time) ||
    validateTimeMax(time, dependingFields["date"])
  );
};

export const validateEndTimeField = (endTime, dependingFields) => {
  return (
    validateEmpty(endTime) ||
    validateTimeFormat(endTime) ||
    validateTimeMax(endTime, dependingFields["date"]) ||
    validateStartTimeBeforeEndTime(dependingFields["startTime"], endTime)
  );
};

export const validatePositionField = (value, min, max, precision) => {
  return (
    validateEmpty(value) ||
    validateMin(value, min) ||
    validateMax(value, max) ||
    validateDecimalPrecision(value, precision)
  );
};
