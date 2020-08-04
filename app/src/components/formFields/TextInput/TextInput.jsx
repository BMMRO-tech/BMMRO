/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";
import getFieldErrorMessage from "../getFieldErrorMessage";
import FieldError from "../FieldError";

const TextInput = ({ name, labelText, maxLength, isRequired, isShort }) => {
  const validateText = (val) => {
    if (!val) {
      if (isRequired) return getFieldErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    if (maxLength && val.length > maxLength) {
      return getFieldErrorMessage(FormErrorType.MAX_CHAR_LENGTH, {
        length: maxLength,
      });
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

export default TextInput;
