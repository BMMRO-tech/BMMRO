/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";
import { useEffect } from "react";

import { usePosition } from "../../../hooks/usePosition";
import getErrorMessage from "../../../utils/getErrorMessage";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";
import FieldError from "../FieldError";

const PositionInput = ({
  name,
  labelText,
  isRequired,
  isShort,
  type,
  autofill,
  isDisabled,
  refreshLatLong,
}) => {
  const position = usePosition(refreshLatLong);

  const positionConfig = {
    latitude: {
      min: -90,
      max: 90,
    },
    longitude: {
      min: -180,
      max: 180,
    },
  };

  const validatePosition = (val) => {
    const digitsPattern = new RegExp(`\\.[0-9]{6}$`);
    const { min, max } = positionConfig[type];

    if (val === "") {
      if (isRequired) return getErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    if (val && isNaN(Number(val))) {
      return getErrorMessage(FormErrorType.INVALID_POSITION_FORMAT);
    }

    if (val && !digitsPattern.test(val)) {
      return getErrorMessage(FormErrorType.INVALID_DECIMAL_PLACES, {
        decimalPlaces: 6,
      });
    }

    if (parseFloat(val) > max) {
      return getErrorMessage(FormErrorType.MAX_VALUE, {
        value: max,
      });
    }

    if (parseFloat(val) < min) {
      return getErrorMessage(FormErrorType.MIN_VALUE, {
        value: min,
      });
    }

    return "";
  };

  const defaultToNegativeValue = (val) => {
    return val === "" || val.startsWith("-") || name !== "longitude"
      ? val
      : `-${val}`;
  };

  const [field, meta, helpers] = useField({
    name,
    validate: validatePosition,
  });

  useEffect(() => {
    if (autofill && position[type]) {
      helpers.setValue(position[type]);
    }
    // eslint-disable-next-line
  }, [position[type]]);

  return (
    <div>
      <label css={fieldStyles.label}>
        <span>{labelText}</span>
        {isRequired && <span css={fieldStyles.required}>*</span>}

        <div css={fieldStyles.inputContainer}>
          <input
            {...field}
            type="number"
            step="any"
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
            disabled={isDisabled}
            data-testid={`field-${name}`}
            onChange={(e) =>
              helpers.setValue(
                defaultToNegativeValue(e.target.value.toString())
              )
            }
          />
        </div>
      </label>
      <FieldError
        touched={meta.touched}
        errorMessage={meta.error}
        labelText={labelText}
      />
    </div>
  );
};

export default PositionInput;
