/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import FieldError from "../FieldError";
import getErrorMessage from "../../../utils/getErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";

const TextInput = ({
  name,
  labelText,
  type,
  maxLength,
  isRequired,
  isShort,
  isDisabled,
}) => {
  const validateText = (val) => {
    if (!val) {
      if (isRequired) return getErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    return "";
  };

  const [field, meta] = useField({
    name,
    validate: validateText,
  });

  return (
    <div>
      <label css={fieldStyles.label}>
        <span>{labelText}</span>
        {isRequired && <span css={fieldStyles.required}>*</span>}

        <div css={fieldStyles.inputContainer}>
          <input
            {...field}
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
            type={type ? type : "text"}
            maxLength={maxLength}
            disabled={isDisabled}
            data-testid={`field-${name}`}
          />
        </div>
      </label>
      <FieldError
        touched={meta.touched}
        errorMessage={meta.error}
        labelText={labelText}
        isRequired={isRequired}
      />
    </div>
  );
};

export default TextInput;
