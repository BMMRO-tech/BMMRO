/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import colors from "../materials/colors";
import ErrorMessage from "./ErrorMessage";

const DatePickerField = ({ config: { name, label, touched, error } }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  const styles = {
    label: css`
      display: block;
      padding-bottom: 5px;
    `,
    input: css`
      width: 100%;
      max-width: 100%;
      margin-right: 5px;
      padding: 5px;
      font-size: 15px;
      border: 1px solid ${!!error && touched ? colors.red : colors.lightBlue};
    `,
    inputContainer: css`
      .react-datepicker-wrapper {
        display: block;
      }
    `,
    errorContainer: css`
      margin-top: 3px;
      min-height: 20px;
    `,
  };

  return (
    <Fragment>
      {label && (
        <label css={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <div css={styles.inputContainer}>
        <DatePicker
          dateFormat="dd MMMM yyyy"
          maxDate={new Date()}
          id={name}
          css={styles.input}
          withPortal
          onFocus={(e) => e.target.blur()}
          customInput={<input data-testid={name} type="text" />}
          selected={(field.value && new Date(field.value)) || null}
          {...field}
          onChange={(val) => {
            setFieldValue(field.name, val);
          }}
        />
      </div>
      <div css={styles.errorContainer}>
        {!!error && touched && (
          <ErrorMessage testId={`error-${error.type}-${name}`} error={error} />
        )}
      </div>
    </Fragment>
  );
};

export default DatePickerField;
