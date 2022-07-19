/** @jsx jsx */
import { jsx } from "@emotion/core";
import fieldStyles from "../fieldStyles";
import { useField } from "formik";

const Checkbox = ({ name, labelText, isDisabled }) => {
  const [field] = useField({
    name,
  });

  return (
    <div>
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
