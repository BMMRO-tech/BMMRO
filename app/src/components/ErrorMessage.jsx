/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";
import { FormErrorType } from "../constants/forms";
import { AuthenticationErrorType } from "../constants/authentication";

const ErrorMessage = ({ error, testId, isInputFieldError = true }) => {
  const message = {
    [FormErrorType.EMPTY]: "Required",
    [FormErrorType.MIN_VALUE]: `Value must be greater than or equal to ${error.rule}`,
    [FormErrorType.MAX_VALUE]: `Value must be less than or equal to ${error.rule}`,
    [FormErrorType.INVALID_NUMBER_FORMAT]: "Invalid number format",
    [FormErrorType.MAX_DATE]: "Date cannot be in the future",
    [FormErrorType.INVALID_DATE_FORMAT]: `Date must be in the following format ${error.rule}`,
    [FormErrorType.MAX_TIME]: "Time cannot be in the future",
    [FormErrorType.INVALID_TIME_FORMAT]: `Time must be in the following format ${error.rule}`,
    [FormErrorType.START_TIME_AFTER_END_TIME]:
      "End time cannot be before start time",
    [FormErrorType.INVALID_POSITION_FORMAT]: `Position must have ${error.rule} decimal digits`,
    [FormErrorType.MAX_CHAR_LENGTH]: `Text cannot be longer than ${error.rule} characters`,
    [AuthenticationErrorType.UNSUCCESSFUL_LOGIN]:
      "The email address or password you entered is not recognised. Please try again.",
    [AuthenticationErrorType.UNSUCCESSFUL_LOGOUT]:
      "There was an error while logging out. Please try again.",
  };

  const styles = {
    error: css`
      color: ${colors.red};
      font-size: ${isInputFieldError ? "13px" : "15px"};
    `,
  };

  return (
    <div data-testid={testId} css={styles.error}>
      {message[error.type]}
    </div>
  );
};

export default ErrorMessage;
