/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import getNumberInputStyle from "./getNumberInputStyle";
import FieldError from "../FieldError";
import getFieldErrorMessage from "../getFieldErrorMessage";
import { FormErrorType } from "../../../constants/forms";

const isNullOrUndefined = (value) => {
  return value === null || value === undefined;
};

const NumberInput = ({
  name,
  labelText,
  maxValue,
  minValue,
  isRequired,
  isInteger,
  isShort,
}) => {
  const validateNumber = (val) => {
    if (val === "") {
      if (isRequired) return getFieldErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    if (isInteger && !Number.isInteger(val)) {
      return getFieldErrorMessage(FormErrorType.INVALID_NUMBER_FORMAT);
    }

    if (!isNullOrUndefined(maxValue) && val > maxValue) {
      return getFieldErrorMessage(FormErrorType.MAX_VALUE, {
        value: maxValue,
      });
    }

    if (!isNullOrUndefined(minValue) && val < minValue) {
      return getFieldErrorMessage(FormErrorType.MIN_VALUE, {
        value: minValue,
      });
    }

    return "";
  };

  const [field, meta] = useField({
    name,
    validate: validateNumber,
  });

  const styles = getNumberInputStyle(meta.error, meta.touched, isShort);

  return (
    <div>
      <label css={styles.label}>
        <span>{labelText}</span>
        <input {...field} type="number" css={styles.input} />
      </label>
      <FieldError
        touched={meta.touched}
        errorMessage={meta.error}
        labelText={labelText}
      />
    </div>
  );
};

export default NumberInput;
