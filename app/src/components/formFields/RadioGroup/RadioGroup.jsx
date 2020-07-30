/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";
import { Fragment } from "react";
import getRadioGroupStyle from "./getRadioGroupStyle";

const RadioGroup = ({ name, labelText, options }) => {
  const [field] = useField({
    name,
  });

  const styles = getRadioGroupStyle();

  return (
    <div>
      <span css={styles.label}>{labelText}</span>
      <div>
        {options.map((option) => {
          return (
            <Fragment key={option.value}>
              <label css={styles.radioLabel}>
                <input
                  {...field}
                  type="radio"
                  id={option.value}
                  value={option.value}
                  css={styles.radioButton}
                />
                {option.label}
              </label>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroup;
