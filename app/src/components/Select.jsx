/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Field } from "formik";

import colors from "../materials/colors";
import ErrorMessage from "./ErrorMessage";

const Select = ({
  config: {
    name,
    label,
    onChange,
    required,
    onBlur,
    options,
    touched,
    value,
    dependingFieldValue,
    error,
    validate,
  },
}) => {
  const styles = {
    label: css`
      display: block;
      padding-bottom: 5px;
    `,
    input: css`
      width: 70%;
      margin-right: 5px;
      padding: 5px;
      font-size: 15px;
      background: ${colors.white};
      border-radius: 0;
      border: 1px solid ${colors.lightBlue};
    `,
  };
  return (
    <Fragment>
      <label css={styles.label} htmlFor={name}>
        {label}
      </label>
      <Field
        css={styles.input}
        name={name}
        value={value}
        id={name}
        data-testid={name}
        onChange={onChange}
        onBlur={onBlur}
        validate={
          required ? (value) => validate(value, dependingFieldValue) : null
        }
        as="select"
      >
        <option key="none" value="">
          -- Please select option --
        </option>
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </Field>
      {!!error && !!touched && (
        <ErrorMessage
          testId={`error-${error.type}-${name}`}
          error={error}
          isInline={true}
        />
      )}
    </Fragment>
  );
};

export default Select;
