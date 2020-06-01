import { FormErrorType } from "./constants";

export const validateField = (value, min, max) => {
  if (!value) return { type: FormErrorType.EMPTY };
  if (value < min)
    return {
      type: FormErrorType.MIN_VALUE,
      rule: min,
    };
  if (value > max)
    return {
      type: FormErrorType.MAX_VALUE,
      rule: max,
    };
};
