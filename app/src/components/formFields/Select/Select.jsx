/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";
import FieldError from "../FieldError";
import getFieldErrorMessage from "../getFieldErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import getSelectStyle from "./getSelectStyle";

const Select = ({ name, labelText, isRequired, options }) => {
  const validate = (val) => {
    if (!val) {
      if (isRequired) return getFieldErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    return "";
  };

  const [field, meta] = useField({ name, validate });

  const styles = getSelectStyle(meta.error, meta.touched);

  return (
    <div>
      <label css={styles.label}>
        <span>{labelText}</span>
        <select {...field} css={styles.select} aria-label={labelText}>
          <option key="none" value="" aria-label="default empty option">
            -- Please select option --
          </option>
          {options.map((option) => (
            <option key={option} value={option} aria-label={option}>
              {option}
            </option>
          ))}
        </select>
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
