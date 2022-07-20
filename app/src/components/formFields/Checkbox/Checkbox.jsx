/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import fieldStyles from "../fieldStyles";
import { useField } from "formik";


const styles = {
  checkboxContainer: css`
    padding: 10px 0px 10px 15px
  `
};


const Checkbox = ({ name, labelText, isDisabled }) => {
  const [field] = useField({
    name,
  });

  return (
    <div css={styles.checkboxContainer}>
      <label css={fieldStyles.label}>
        <div css={fieldStyles.inputContainer}>
          {labelText}
          <input
            {...field}
            type="checkbox"
            disabled={isDisabled}
            data-testid={`field-${name}`}
          />
        </div>
      </label>
    </div>
  );
};

export default Checkbox;
