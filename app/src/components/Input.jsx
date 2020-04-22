/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";

import colors from "../materials/colors";

const Input = ({
  type,
  name,
  label,
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
      padding: 5px;
      font-size: 15px;
      border: 1px solid ${colors.darkBlue};
    `,
    error: css`
      padding-left: 5px;
      color: ${colors.red};
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
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
      {!!error && !!touched && <span css={styles.error}>{error}</span>}
    </Fragment>
  );
};

export default Input;
