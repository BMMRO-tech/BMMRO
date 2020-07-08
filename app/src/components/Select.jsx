/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Field } from "formik";
import appStyles from "../materials/appStyles";
import ErrorMessage from "./ErrorMessage";

const Select = ({
  config: {
    name,
    label,
    onChange,
    onBlur,
    options,
    touched,
    value,
    dependingFields,
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
      width: 100%;
      margin-right: 5px;
      padding: 5px;
      font-size: 15px;
      background: ${appStyles.colors.white};
      border-radius: 0;
      border: 1px solid
        ${!!error && touched
          ? appStyles.colors.red
          : appStyles.colors.lightBlue};
    `,
    errorContainer: css`
      margin-top: 2px;
      min-height: 18px;
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
          !!validate ? (value) => validate(value, dependingFields) : null
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
      <div css={styles.errorContainer}>
        {!!error && !!touched && (
          <ErrorMessage testId={`error-${error.type}-${name}`} error={error} />
        )}
      </div>
    </Fragment>
  );
};

export default Select;
