/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";
import { Field } from "formik";

import colors from "../materials/colors";
import ErrorMessage from "./ErrorMessage";

const Input = ({
  config: { type, name, label, placeholder, touched, value, error, validate },
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
      border: 1px solid ${colors.lightBlue};
    `,
  };
  return (
    <Fragment>
      <label css={styles.label} htmlFor={name}>
        {label}
      </label>
      <Field
        as={type === "textarea" ? type : null}
        css={styles.input}
        type={type}
        name={name}
        placeholder={placeholder}
        id={name}
        data-testid={name}
        value={value}
        validate={validate}
      />
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

export default Input;
