/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import { FormErrorType } from "../../../constants/forms";
import getFieldErrorMessage from "../getFieldErrorMessage";
import fieldStyles from "../fieldStyles";
import FieldError from "../FieldError";

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

  return (
    <div>
      <label css={fieldStyles.label}>
        <span>{labelText}</span>
        <div css={fieldStyles.inputContainer}>
          <input
            {...field}
            type="number"
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

export default NumberInput;
