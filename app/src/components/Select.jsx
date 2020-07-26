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
      span {
        display: block;
        padding-bottom: 5px;
      }

      &:focus-within {
        span {
          color: ${colors.darkTurquoise};
          font-weight: 700;
        }

        select {
          outline: 2px solid ${colors.mediumTurquoise};
        }
      }
    `,
    input: css`
      width: 100%;
      margin-right: 5px;
      padding: 5px;
      font-size: 16px;
      background: ${colors.white};
      border-radius: 0;
      border: 1px solid
        ${!!error && touched ? colors.darkRed : colors.mediumGray};
      border-radius: 2px;
    `,
    errorContainer: css`
      margin-top: 2px;
      min-height: 18px;
    `,
  };
  return (
    <Fragment>
      <label css={styles.label}>
        <span>{label}</span>
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
      </label>

      <div css={styles.errorContainer}>
        {!!error && !!touched && (
          <ErrorMessage testId={`error-${error.type}-${name}`} error={error} />
        )}
      </div>
    </Fragment>
  );
};

export default Select;
