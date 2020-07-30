/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import getTextAreaInputStyle from "./getTextAreaInputStyle";
import FieldError from "../FieldError";
import getFieldErrorMessage from "../getFieldErrorMessage";
import { FormErrorType } from "../../../constants/forms";

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

  const styles = getTextAreaInputStyle(meta.error, meta.touched);

  return (
    <div>
      <label css={styles.label}>
        <span>{labelText}</span>
        <textarea {...field} css={styles.input} aria-label={labelText} />
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
