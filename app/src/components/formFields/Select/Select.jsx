/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";

import FieldError from "../FieldError";
import getErrorMessage from "../../../utils/getErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";
import * as PropTypes from "prop-types";

function Dropdown(props) {
  return (
    <label css={fieldStyles.label}>
      <span>{props.labelText}</span>
      {props.required && <span css={fieldStyles.required}>*</span>}

      <div css={fieldStyles.inputContainer}>
        <select
          {...props.field}
          css={fieldStyles.getInputStyles(
            props.meta.error,
            props.meta.touched,
            props.short
          )}
          disabled={props.disabled}
          data-testid={`field-${props.name}`}
          id={props.name}
        >
          <option key="none" value="" aria-label="default empty option">
            -- Select --
          </option>
          {props.options.map((option) => (
            <option key={option} value={option} aria-label={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

Dropdown.propTypes = {
  labelText: PropTypes.any,
  required: PropTypes.any,
  field: PropTypes.any,
  meta: PropTypes.any,
  short: PropTypes.any,
  disabled: PropTypes.any,
  name: PropTypes.any,
  options: PropTypes.any,
};
const Select = ({
  name,
  labelText,
  isRequired,
  isShort,
  isDisabled,
  options,
}) => {
  const validate = (val) => {
    if (!val) {
      if (isRequired) return getErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    return "";
  };

  const [field, meta] = useField({ name, validate });

  return (
    <div>
      <Dropdown
        labelText={labelText}
        required={isRequired}
        field={field}
        meta={meta}
        short={isShort}
        disabled={isDisabled}
        name={name}
        options={options}
      />
      <FieldError
        touched={meta.touched}
        errorMessage={meta.error}
        labelText={labelText}
        isRequired={isRequired}
      />
    </div>
  );
};

export default Select;
export { Dropdown };
