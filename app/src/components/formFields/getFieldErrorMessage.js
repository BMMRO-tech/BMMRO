import { FormErrorType } from "../../constants/forms";

const getFieldErrorMessage = (type, params) => {
  switch (type) {
    case FormErrorType.MAX_CHAR_LENGTH:
      return `Text cannot be longer than ${params.length} characters`;
    case FormErrorType.MAX_VALUE:
      return `Value must be less than or equal to ${params.value}`;
    case FormErrorType.MIN_VALUE:
      return `Value must be greater than or equal to ${params.value}`;
    case FormErrorType.INVALID_NUMBER_FORMAT:
      return "Invalid number format";
    case FormErrorType.INVALID_TIME_FORMAT:
      return `Time must be in the following format ${params.format}`;
    case FormErrorType.INVALID_POSITION_FORMAT:
      return "Invalid position format";
    case FormErrorType.EMPTY:
      return "Required";
    default:
      return "";
  }
};

export default getFieldErrorMessage;
