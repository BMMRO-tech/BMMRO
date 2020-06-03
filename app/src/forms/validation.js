import { parse, isValid } from "date-fns";
import { FormErrorType } from "./constants";

export const validateEmpty = (value) => {
  if (!value) return { type: FormErrorType.EMPTY };
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

const validateDateFormat = (value, format) => {
  const date = parse(value, format, new Date());

  if (!isValid(date)) {
    return {
      type: FormErrorType.INVALID_DATE_FORMAT,
      rule: format,
    };
  }
};

const validateDateMax = (value, format, max = new Date(Date.now())) => {
  const parsedDate = parse(value, format, new Date());

  if (parsedDate > max) {
    return {
      type: FormErrorType.MAX_DATE,
    };
  }
};

const validateTimeFormat = (value, format) => {
  const time = parse(value, format, new Date());

  if (!isValid(time)) {
    return {
      type: FormErrorType.INVALID_TIME_FORMAT,
      rule: format,
    };
  }
};

const validateTimeMax = (
  time,
  date,
  timeFromat,
  dateFormat,
  max = new Date(Date.now())
) => {
  const dateWithTime = `${date} ${time}`;
  const fromatDateWithTime = `${dateFormat} ${timeFromat}`;
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

export const validateNumericField = (value, min, max) => {
  return (
    validateEmpty(value) || validateMin(value, min) || validateMax(value, max)
  );
};

export const validateDateField = (value, format) => {
  return (
    validateEmpty(value) ||
    validateDateFormat(value, format) ||
    validateDateMax(value, format)
  );
};

export const validateTimeField = (time, date, timeFormat, dateFormat) => {
  return (
    validateEmpty(time) ||
    validateTimeFormat(time, timeFormat) ||
    validateTimeMax(time, date, timeFormat, dateFormat)
  );
};
