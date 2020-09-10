/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useState } from "react";
import { useField } from "formik";

import NumberInput from "../NumberInput/NumberInput";
import FieldError from "../FieldError";
import fieldStyles from "../fieldStyles";

const NumberWithCheckbox = ({
  numberInputName,
  labelText,
  maxValue,
  minValue,
  isRequired,
  isInteger,
  isShort,
  decimalPrecision,
  isDisabled,
  checkboxName,
  checkboxLabel,
}) => {
  const [numberField, meta, helpers] = useField(numberInputName);
  const [checkboxField] = useField(checkboxName);
  const [numberDisabled, setNumberDisabled] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleCheckboxChange = (e) => {
    checkboxField.onChange(e);
    setNumberDisabled(e.target.checked);
    if (e.target.checked) {
      setUserInput(numberField.value);
      helpers.setValue("");
    } else {
      helpers.setValue(userInput);
    }
  };

  useEffect(() => {
    setNumberDisabled(checkboxField.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <NumberInput
        {...numberField}
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
          {...checkboxField}
          css={fieldStyles.checkboxInput}
          disabled={isDisabled}
          type="checkbox"
          checked={checkboxField.value}
          onChange={handleCheckboxChange}
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
