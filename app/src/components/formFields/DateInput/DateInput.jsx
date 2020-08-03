/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import getDateInputStyle from "./getDateInputStyle";
import FieldError from "../FieldError";
import getFieldErrorMessage from "../getFieldErrorMessage";
import { FormErrorType } from "../../../constants/forms";

const DateInput = ({ name, labelText, isRequired }) => {
  const validateText = (val) => {
    if (!val && isRequired) {
      return getFieldErrorMessage(FormErrorType.EMPTY);
    }

    return "";
  };

  const [field, meta, helpers] = useField({
    name,
    validate: validateText,
  });

  const styles = getDateInputStyle(meta.error, meta.touched);

  return (
    <div>
      <div>
        <label css={styles.label}>
          <span>{labelText}</span>
          {isRequired ? <span css={styles.required}>*</span> : ""}

          <DatePicker
            dateFormat="dd MMMM yyyy"
            maxDate={new Date()}
            id={name}
            css={styles.input}
            withPortal
            onFocus={(e) => e.target.blur()}
            customInput={<input aria-label={labelText} type="text" />}
            selected={(field.value && new Date(field.value)) || null}
            {...field}
            onChange={helpers.setValue}
          />
        </label>
      </div>
      <FieldError
        touched={meta.touched}
        errorMessage={meta.error}
        labelText={labelText}
      />
    </div>
  );
};

export default DateInput;
