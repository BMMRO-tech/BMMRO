/** @jsx jsx */
import { Global, css, jsx } from "@emotion/core";
import { Fragment } from "react";

const Input = ({
  type,
  name,
  label,
  onChange,
  onBlur,
  touched,
  value,
  error,
}) => (
  <Fragment>
    <label
      css={css`
        display: block;
        padding-bottom: 5px;
      `}
      htmlFor={name}
    >
      {label}
    </label>
    <input
      css={css`
        padding: 5px;
        font-size: 15px;
        border: 1px solid darkgrey;
      `}
      type={type}
      name={name}
      id={name}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
    />
    {!!error && !!touched && <span css={css`
        padding-left: 5px;
        color: #FB4D3D;
      `}>{error}</span>}
  </Fragment>
);

export default Input;
