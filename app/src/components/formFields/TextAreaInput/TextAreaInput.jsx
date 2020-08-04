/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";
import getFieldErrorMessage from "../getFieldErrorMessage";
import FieldError from "../FieldError";

const TextAreaInput = ({ name, labelText, maxLength, isRequired }) => {
  const validateTextArea = (val) => {
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
    validate: validateTextArea,
  });

  return (
    <div>
      <label css={fieldStyles.label}>
        <span>{labelText}</span>
        <textarea
          {...field}
          css={fieldStyles.getInputStyles(meta.error, meta.touched)}
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

export default TextAreaInput;
