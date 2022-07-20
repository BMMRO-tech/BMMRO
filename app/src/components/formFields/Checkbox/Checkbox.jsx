/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import fieldStyles from "../fieldStyles";
import { useField, Field } from "formik";

const styles = {
  checkboxContainer: css`
    padding: 10px 0px 10px 15px;
  `,
};

const Checkbox = ({ name, labelText, isDisabled }) => {
  

  return (
    <div css={styles.checkboxContainer}>
      <label css={fieldStyles.label}>
        <div css={fieldStyles.inputContainer}>
        <label>
          {labelText}
            <Field 
            type="checkbox" 
            name={name} 
            disabled={isDisabled}
            data-testid={`field-${name}`}
            />
            {true}
          </label>
        </div>
      </label>
    </div>
  );
};

export default Checkbox;
