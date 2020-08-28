/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import { useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import FieldError from "../FieldError";
import getErrorMessage from "../../../utils/getErrorMessage";
import { getCurrentDate } from "../../../utils/time";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";

const DateInput = ({
  name,
  labelText,
  isRequired,
  isShort,
  autofill,
  notBefore,
  notAfter,
  isDisabled,
}) => {
  const validateDate = (val) => {
    if (!val && isRequired) {
      return getErrorMessage(FormErrorType.EMPTY);
    }

    if (notBefore && val < notBefore) {
      return getErrorMessage(FormErrorType.END_DATE_BEFORE_START_DATE);
    }

    if (notAfter && val > notAfter) {
      return getErrorMessage(FormErrorType.INVALID_END_DATE);
    }

    return "";
  };

  const [field, meta, helpers] = useField({
    name,
    validate: validateDate,
  });

  useEffect(() => {
    if (autofill) helpers.setValue(getCurrentDate());
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div>
        <label css={fieldStyles.label}>
          <span>{labelText}</span>
          {isRequired && <span css={fieldStyles.required}>*</span>}

          <DatePicker
            dateFormat="dd MMMM yyyy"
            minDate={notBefore}
            maxDate={notAfter}
            id={name}
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
            withPortal
            onFocus={(e) => e.target.blur()}
            customInput={
              <input
                type="text"
                data-field-type="datepicker"
                data-testid={`field-${name}`}
              />
            }
            selected={(field.value && new Date(field.value)) || null}
            {...field}
            onChange={helpers.setValue}
            disabled={isDisabled}
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
