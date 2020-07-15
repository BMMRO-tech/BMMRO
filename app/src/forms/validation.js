import { parse, isValid, format } from "date-fns";
import { FormErrorType, DATE_FORMAT, TIME_FORMAT } from "../constants/forms";

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

const validateInteger = (value) => {
  if (!Number.isInteger(value)) {
    return {
      type: FormErrorType.INVALID_NUMBER_FORMAT,
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

const validatePositionFormat = (value, precision) => {
  const positionFormat = RegExp(`^-?[0-9]*.[0-9]{${precision}}$`);
  if (!positionFormat.test(value)) {
    return {
      type: FormErrorType.INVALID_POSITION_FORMAT,
      rule: precision,
    };
  }
};

const validateDateMax = (value, max = new Date(Date.now())) => {
  if (value > max) {
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
  const formattedDate = format(date, DATE_FORMAT);

  const dateTime = parse(
    `${formattedDate} ${time}`,
    `${DATE_FORMAT} ${TIME_FORMAT}`,
    new Date()
  );

  if (dateTime > max) {
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

export const validateFloatField = (value, min, max, optional = true) => {
  return value === "" && optional
    ? ""
    : validateMin(value, min) || validateMax(value, max);
};

export const validateIntegerField = (value, min, max, optional = true) => {
  return value === "" && optional
    ? ""
    : validateInteger(value) ||
        validateMin(value, min) ||
        validateMax(value, max);
};

export const validateEncSeq = (value, min, max) => {
  return (
    validateEmpty(value) ||
    validateInteger(value) ||
    validateMin(value, min) ||
    validateMax(value, max)
  );
};

export const validateDateField = (value) => {
  return validateEmpty(value) || validateDateMax(value);
};

export const validateTextField = (value, max) => {
  return validateMaxCharLength(value, max);
};

export const validateStartTimeField = (time, dependingFields) => {
  return (
    validateEmpty(time) ||
    validateTimeFormat(time) ||
    validateTimeMax(time, dependingFields["date"])
  );
};

export const validateEndTimeField = (endTime, dependingFields) => {
  if (!endTime) return "";

  return (
    validateTimeFormat(endTime) ||
    validateTimeMax(endTime, dependingFields["date"]) ||
    validateStartTimeBeforeEndTime(dependingFields["startTime"], endTime)
  );
};

export const validatePositionField = (value, min, max, precision) => {
  return (
    validateEmpty(value) ||
    validatePositionFormat(value, precision) ||
    validateMin(parseFloat(value), min) ||
    validateMax(parseFloat(value), max)
  );
};
