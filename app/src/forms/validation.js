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

const validateDateMax = (value, max, format) => {
  const parsedDate = parse(value, format, new Date());

  if (parsedDate > max) {
    return {
      type: FormErrorType.MAX_DATE,
    };
  }
};

export const validateDateField = (value, max, format) => {
  return (
    validateEmpty(value) ||
    validateDateFormat(value, format) ||
    validateDateMax(value, max, format)
  );
};

export const validateNumericField = (value, min, max) => {
  return (
    validateEmpty(value) || validateMin(value, min) || validateMax(value, max)
  );
};
