/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";

import colors from "../materials/colors";
import ErrorMessage from "./ErrorMessage";

const Select = ({
  name,
  label,
  onChange,
  onBlur,
  options,
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
      <select
        css={styles.input}
        name={name}
        value={value}
        id={name}
        onChange={onChange}
        onBlur={onBlur}
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
      </select>
      {!!error && !!touched && <ErrorMessage text={error} isInline={true} />}
    </Fragment>
  );
};

export default Select;
