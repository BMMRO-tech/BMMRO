/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import FieldError from "../FieldError";
import getErrorMessage from "../../../utils/getErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";

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
      if (isRequired) return getErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    if (isInteger && !Number.isInteger(val)) {
      return getErrorMessage(FormErrorType.INVALID_NUMBER_FORMAT);
    }

    if (!isNullOrUndefined(maxValue) && val > maxValue) {
      return getErrorMessage(FormErrorType.MAX_VALUE, {
        value: maxValue,
      });
    }

    if (!isNullOrUndefined(minValue) && val < minValue) {
      return getErrorMessage(FormErrorType.MIN_VALUE, {
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
        {isRequired && <span css={fieldStyles.required}>*</span>}
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
