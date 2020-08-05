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
} from "../../../constants/forms";
import fieldStyles from "../fieldStyles";
import getErrorMessage from "../../../utils/getErrorMessage";
import { getCurrentDate } from "../../../utils/time";

const formatTime = (date) => format(date, TIME_FORMAT);

const timeStringToMinutes = (time) => {
  const [hours, mins] = time.match(/\d{2}/g);
  return Number(hours) * 60 + Number(mins);
};

const timeStringValid = (val) => {
  const timePattern = new RegExp(TIME_PATTERN);
  return timePattern.test(val);
};

const TimeInput = ({
  name,
  labelText,
  autofill,
  isShort,
  isRequired,
  notBefore,
  notInFuture,
}) => {
  const validateTime = (val) => {
    if (val && !timeStringValid(val)) {
      return getErrorMessage(FormErrorType.INVALID_TIME_FORMAT, {
        format: "hh:mm",
      });
    }

    if (val && notInFuture) {
      const dateTime = getCurrentDate().setHours(
        val.split(":")[0],
        val.split(":")[1]
      );

      if (dateTime > getCurrentDate()) {
        return getErrorMessage(FormErrorType.DATE_IN_FUTURE);
      }
    }

    if (val && notBefore && timeStringValid(notBefore)) {
      if (timeStringToMinutes(notBefore) > timeStringToMinutes(val)) {
        return getErrorMessage(FormErrorType.START_TIME_AFTER_END_TIME);
      }
    }

    return "";
  };

  const [field, meta, helpers] = useField({
    name,
    validate: validateTime,
  });

  useEffect(() => {
    if (autofill) helpers.setValue(formatTime(getCurrentDate()));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (field.value === "__:__") helpers.setValue("");
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
            mask="99:99"
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
            aria-label={labelText}
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
