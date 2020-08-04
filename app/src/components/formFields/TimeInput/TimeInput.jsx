/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import { useField } from "formik";
import { format } from "date-fns";
import InputMask from "react-input-mask";

import getTimeInputStyle from "./getTimeInputStyle";
import FieldError from "../FieldError";
import getFieldErrorMessage from "../getFieldErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import { TIME_FORMAT } from "../../../constants/forms";

const getCurrentDate = () => new Date(Date.now());

const formatTime = (date) => format(date, TIME_FORMAT);

const TimeInput = ({ name, labelText, autofill, isShort }) => {
  const validateTime = (val) => {
    const timePattern = new RegExp("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$");

    if (val && !timePattern.test(val)) {
      return getFieldErrorMessage(FormErrorType.INVALID_TIME_FORMAT, {
        format: "hh:mm",
      });
    }
    return "";
  };

  const [field, meta, helpers] = useField({
    name,
    validate: validateTime,
  });

  useEffect(() => {
    if (autofill) {
      helpers.setValue(formatTime(getCurrentDate()));
    }
    // eslint-disable-next-line
  }, []);

  const styles = getTimeInputStyle(meta.error, meta.touched, isShort);

  return (
    <div>
      <label css={styles.label}>
        <span>{labelText}</span>
        <InputMask
          {...field}
          mask="99:99"
          css={styles.input}
          aria-label={labelText}
        />
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
