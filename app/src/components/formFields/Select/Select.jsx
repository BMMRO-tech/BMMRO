/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import FieldError from "../FieldError";
import getErrorMessage from "../../../utils/getErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";

const Select = ({
  name,
  labelText,
  isRequired,
  isShort,
  isDisabled,
  options,
}) => {
  const validate = (val) => {
    if (!val) {
      if (isRequired) return getErrorMessage(FormErrorType.EMPTY);
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
            disabled={isDisabled}
            data-testid={`field-${name}`}
          >
            <option key="none" value="" aria-label="default empty option">
              -- Select --
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
