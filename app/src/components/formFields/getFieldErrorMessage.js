import { FormErrorType } from "../../constants/forms";

const getFieldErrorMessage = (type, params) => {
  switch (type) {
    case FormErrorType.MAX_CHAR_LENGTH:
      return `Text cannot be longer than ${params.length} characters`;
    case FormErrorType.EMPTY:
      return "Required";
    default:
      return "";
  }
};

export default getFieldErrorMessage;
