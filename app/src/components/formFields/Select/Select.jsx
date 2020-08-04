/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import { FormErrorType } from "../../../constants/forms";
import getFieldErrorMessage from "../getFieldErrorMessage";
import fieldStyles from "../fieldStyles";
import FieldError from "../FieldError";

const Select = ({ name, labelText, isRequired, isShort, options }) => {
  const validate = (val) => {
    if (!val) {
      if (isRequired) return getFieldErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    return "";
  };

  const [field, meta] = useField({ name, validate });

  return (
    <div>
      <label css={fieldStyles.label}>
        <span>{labelText}</span>
        {isRequired && <span css={fieldStyles.required}>*</span>}

        <div css={fieldStyles.inputContainer}>
          <select
            {...field}
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
            aria-label={labelText}
          >
            <option key="none" value="" aria-label="default empty option">
              -- Select option --
            </option>
            {options.map((option) => (
              <option key={option} value={option} aria-label={option}>
                {option}
              </option>
            ))}
          </select>
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

export default Select;
