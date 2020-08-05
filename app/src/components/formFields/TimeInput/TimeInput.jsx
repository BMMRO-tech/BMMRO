/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import { useField, useFormikContext } from "formik";
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

const getCurrentDate = () => new Date(Date.now());
const formatTime = (date) => format(date, TIME_FORMAT);
const timePattern = new RegExp("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$");

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
  priorTimeName,
}) => {
  const formikContext = useFormikContext();

  const validateTime = (val) => {
    if (val && !timeStringValid(val)) {
      return getErrorMessage(FormErrorType.INVALID_TIME_FORMAT, {
        format: "hh:mm",
      });
    }

    const priorTimeValue = formikContext.values[priorTimeName];
    if (
      priorTimeValue &&
      timeStringValid(priorTimeValue) &&
      timeStringToMinutes(priorTimeValue) >
        timeStringToMinutes(formikContext.values[name])
    ) {
      return getErrorMessage(FormErrorType.START_TIME_AFTER_END_TIME);
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
