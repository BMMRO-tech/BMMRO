/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Field } from "formik";

import colors from "../materials/colors";
import ErrorMessage from "./ErrorMessage";

const Input = ({
  config: {
    type,
    name,
    label,
    placeholder,
    touched,
    value,
    dependingFields,
    error,
    validate,
    onBlur,
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

        input {
          outline: 2px solid ${colors.mediumTurquoise};
        }

        textarea {
          outline: 2px solid ${colors.mediumTurquoise};
        }
      }
    `,
    input: css`
      width: 100%;
      max-width: 100%;
      margin-right: 5px;
      padding: 5px;
      font-size: 16px;
      border: 1px solid
        ${!!error && touched ? colors.darkRed : colors.mediumGray};
      border-radius: 2px;
      ${type === "textarea" && "min-height: 120px;"}
    `,
    errorContainer: css`
      margin-top: 3px;
      min-height: 20px;
    `,
  };

  return (
    <Fragment>
      <label css={styles.label}>
        <span>{label}</span>
        <Field
          as={type === "textarea" ? type : null}
          css={styles.input}
          type={type}
          name={name}
          placeholder={placeholder}
          id={name}
          data-testid={name}
          value={value}
          onBlur={onBlur}
          validate={
            !!validate ? (value) => validate(value, dependingFields) : null
          }
        />
      </label>

      <div css={styles.errorContainer}>
        {!!error && touched && (
          <ErrorMessage testId={`error-${error.type}-${name}`} error={error} />
        )}
      </div>
    </Fragment>
  );
};

export default Input;
