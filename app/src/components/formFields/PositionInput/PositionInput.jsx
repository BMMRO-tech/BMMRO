/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useField } from "formik";
import { useEffect } from "react";

import { usePosition } from "../../../hooks/usePosition";
import { FormErrorType } from "../../../constants/forms";
import fieldStyles from "../fieldStyles";
import getFieldErrorMessage from "../getFieldErrorMessage";
import FieldError from "../FieldError";

const PositionInput = ({
  name,
  labelText,
  isRequired,
  isShort,
  type,
  autofill,
}) => {
  const position = usePosition();

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
    const positionPattern = new RegExp(`^-?[0-9]*.[0-9]{6}$`);
    const { min, max } = positionConfig[type];

    if (val === "") {
      if (isRequired) return getFieldErrorMessage(FormErrorType.EMPTY);
      else return "";
    }

    if (val && !positionPattern.test(val)) {
      return getFieldErrorMessage(FormErrorType.INVALID_POSITION_FORMAT);
    }

    if (parseFloat(val) > max) {
      return getFieldErrorMessage(FormErrorType.MAX_VALUE, {
        value: max,
      });
    }

    if (parseFloat(val) < min) {
      return getFieldErrorMessage(FormErrorType.MIN_VALUE, {
        value: min,
      });
    }

    return "";
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
            type="text"
            css={fieldStyles.getInputStyles(meta.error, meta.touched, isShort)}
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
