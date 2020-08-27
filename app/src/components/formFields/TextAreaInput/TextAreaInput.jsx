/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import FieldError from "../FieldError";
import getErrorMessage from "../../../utils/getErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";

const TextAreaInput = ({
  name,
  labelText,
  maxLength,
  isRequired,
  isDisabled,
}) => {
  const validateTextArea = (val) => {
    if (!val) {
      if (isRequired) return getErrorMessage(FormErrorType.EMPTY);
      else return "";
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
        {isRequired && <span css={fieldStyles.required}>*</span>}

        <textarea
          {...field}
          css={fieldStyles.getInputStyles(meta.error, meta.touched)}
          maxLength={maxLength}
          disabled={isDisabled}
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
