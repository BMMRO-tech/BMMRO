/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";
import getTextInputStyle from "./getTextInputStyle";
import FieldError from "../FieldError";
import getFieldErrorMessage from "../getFieldErrorMessage";
import { FormErrorType } from "../../../constants/forms";

const TextInput = ({ name, labelText, maxLength, isRequired }) => {
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

  const styles = getTextInputStyle(meta.error, meta.touched);

  return (
    <div>
      <label css={styles.label}>
        <span>{labelText}</span>
        {isRequired ? <span css={styles.required}>*</span> : ""}
        <input {...field} css={styles.input} aria-label={labelText} />
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
