/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";

import colors from "../materials/colors";
import ErrorMessage from "./ErrorMessage";

const Input = ({
  type,
  name,
  label,
  placeholder,
  onChange,
  onBlur,
  touched,
  value,
  error,
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
      <input
        css={styles.input}
        type={type}
        name={name}
        placeholder={placeholder}
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
      {!!error && !!touched && <ErrorMessage text={error} isInline={true} />}
    </Fragment>
  );
};

export default Input;
