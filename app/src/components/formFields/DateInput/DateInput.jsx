/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FormErrorType } from "../../../constants/forms";
import getFieldErrorMessage from "../getFieldErrorMessage";
import fieldStyles from "../fieldStyles";
import FieldError from "../FieldError";

const DateInput = ({ name, labelText, isRequired, isShort }) => {
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

  return (
    <div>
      <div>
        <label css={fieldStyles.label}>
          <span>{labelText}</span>
          {isRequired && <span css={fieldStyles.required}>*</span>}

          <DatePicker
            dateFormat="dd MMMM yyyy"
            maxDate={new Date()}
            id={name}
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
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
