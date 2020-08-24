/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import { useField } from "formik";
import { format } from "date-fns";
import InputMask from "react-input-mask";

import FieldError from "../FieldError";
import {
  FormErrorType,
  TIME_FORMAT,
  TIME_PATTERN,
  TIME_WITH_SECONDS_FORMAT,
  TIME_WITH_SECONDS_PATTERN,
} from "../../../constants/forms";
import fieldStyles from "../fieldStyles";
import getErrorMessage from "../../../utils/getErrorMessage";
import { getCurrentDate, constructDateTime } from "../../../utils/time";

const formatTime = (date, timeFormat) => format(date, timeFormat);

const timeStringValid = (val, pattern) => {
  const timePattern = new RegExp(pattern);
  return timePattern.test(val);
};

const TimeInput = ({
  name,
  labelText,
  autofill,
  isShort,
  isRequired,
  notBefore,
  notAfter,
  associatedDate,
  timeWithSeconds,
}) => {
  const timePattern = timeWithSeconds
    ? TIME_WITH_SECONDS_PATTERN
    : TIME_PATTERN;

  const timeFormat = timeWithSeconds ? TIME_WITH_SECONDS_FORMAT : TIME_FORMAT;

  const validateTime = (val) => {
    if (!val && isRequired) {
      return getErrorMessage(FormErrorType.EMPTY);
    }

    if (val && !timeStringValid(val, timePattern)) {
      return getErrorMessage(FormErrorType.INVALID_TIME_FORMAT, {
        format: timeFormat.toLowerCase(),
      });
    }

    if (val && associatedDate) {
      const dateTime = constructDateTime(associatedDate, val);

      if (notAfter && dateTime > notAfter) {
        return getErrorMessage(FormErrorType.INVALID_END_TIME);
      }

      if (notBefore && dateTime < notBefore) {
        return getErrorMessage(FormErrorType.END_TIME_BEFORE_START_TIME);
      }
    }

    return "";
  };

  const [field, meta, helpers] = useField({
    name,
    validate: validateTime,
  });

  useEffect(() => {
    if (autofill) helpers.setValue(formatTime(getCurrentDate(), timeFormat));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      (timeWithSeconds && field.value === "__:__:__") ||
      (!timeWithSeconds && field.value === "__:__")
    ) {
      helpers.setValue("");
    }

    // eslint-disable-next-line
  }, [field.value]);

  return (
    <div>
      <label css={fieldStyles.label}>
        <span>{labelText}</span>
        {isRequired && <span css={fieldStyles.required}>*</span>}

        <div css={fieldStyles.inputContainer}>
          <InputMask
            {...field}
            mask={timeWithSeconds ? "99:99:99" : "99:99"}
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
          />
        </div>
      </label>
      <FieldError
        touched={meta.touched}
        errorMessage={meta.error}
        labelText={labelText}
      />
    </div>
  );
};

export default TimeInput;
