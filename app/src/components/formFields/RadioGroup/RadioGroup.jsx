/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";
import { Fragment } from "react";
import getRadioGroupStyle from "./getRadioGroupStyle";
import fieldStyles from "../fieldStyles";

const RadioGroup = ({ name, labelText, options, isRequired }) => {
  const [field] = useField({
    name,
  });

  const styles = getRadioGroupStyle();

  return (
    <div css={styles.radioGroupContainer}>
      <span css={styles.label}>{labelText}</span>
      {isRequired && <span css={fieldStyles.required}>*</span>}
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
                  checked={field.value === option.value}
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
