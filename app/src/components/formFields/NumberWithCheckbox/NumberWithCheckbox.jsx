/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, Fragment, useState } from "react";
import { useField } from "formik";

import NumberInput from "../NumberInput/NumberInput";
import FieldError from "../FieldError";
import fieldStyles from "../fieldStyles";

const NumberWithCheckbox = ({
  name,
  labelText,
  maxValue,
  minValue,
  isRequired,
  isInteger,
  isShort,
  decimalPrecision,
  isDisabled,
  checkboxLabel,
  checkboxDefaultValue,
}) => {
  const [field, meta, helpers] = useField(name);
  const [numberDisabled, setNumberDisabled] = useState(false);
  const [userInput, setUserInput] = useState("");

  const checkboxChanged = (e) => {
    if (e.target.checked) {
      setUserInput(field.value);
      helpers.setValue(checkboxDefaultValue);
    } else {
      helpers.setValue(userInput);
    }
  };

  useEffect(() => {
    setNumberDisabled(field.value == checkboxDefaultValue);
  }, [field.value]);

  return (
    <div>
      <NumberInput
        name={name}
        labelText={labelText}
        minValue={minValue}
        maxValue={maxValue}
        isShort={isShort}
        isInteger={isInteger}
        isDisabled={isDisabled || numberDisabled}
        isRequired={isRequired}
        decimalPrecision={decimalPrecision}
        isChildInput
      />
      <label css={fieldStyles.checkboxLabel}>
        <input
          css={fieldStyles.checkboxInput}
          disabled={isDisabled}
          type="checkbox"
          onChange={checkboxChanged}
          checked={field.value === checkboxDefaultValue}
        />
        <span>{checkboxLabel}</span>
      </label>
      <FieldError
        touched={meta.touched}
        errorMessage={meta.error}
        labelText={labelText}
      />
    </div>
  );
};

export default NumberWithCheckbox;
