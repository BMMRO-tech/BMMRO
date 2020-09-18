/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import { useField } from "formik";

import FieldError from "../FieldError";
import { TIME_PATTERN } from "../../../constants/forms";
import { FormErrorType } from "../../../constants/forms";
import { constructDateTime } from "../../../utils/time";
import getErrorMessage from "../../../utils/getErrorMessage";
import fieldStyles from "../fieldStyles";

const timeStringValid = (val) => {
  const timePattern = new RegExp(TIME_PATTERN);
  return timePattern.test(val);
};

const ElapsedTime = ({ notAfter }) => {
  const [startTimestampField] = useField("startTimestamp");
  const [startTimeField] = useField("startTime");
  const [endTimestampField] = useField("endTimestamp");
  const [endTimeField] = useField("endTime");
  const fieldName = "elapsedTime";

  const realEndTimestamp = constructDateTime(
    endTimestampField.value,
    endTimeField.value
  );

  const validateEndDateAndTime = () => {
    if (
      (!!endTimestampField.value && !endTimeField.value) ||
      (!endTimestampField.value && !!endTimeField.value)
    ) {
      return getErrorMessage(FormErrorType.CONDITIONALLY_REQUIRED, {
        first: "end date",
        second: "end time",
      });
    } else if (notAfter && realEndTimestamp > notAfter) {
      return getErrorMessage(FormErrorType.INVALID_END_TIME);
    }

    return "";
  };

  const [field, meta, helpers] = useField({
    name: fieldName,
    validate: validateEndDateAndTime,
  });

  useEffect(() => {
    if (
      timeStringValid(startTimeField.value) &&
      timeStringValid(endTimeField.value)
    ) {
      const startDateTime = constructDateTime(
        startTimestampField.value,
        startTimeField.value
      );

      const endDateTime = constructDateTime(
        endTimestampField.value,
        endTimeField.value
      );

      const elapsedTime = endDateTime - startDateTime;

      if (elapsedTime >= 0) {
        const elapsedMinutes = Math.round(elapsedTime / 60000);
        helpers.setValue(elapsedMinutes);
      }
    } else {
      helpers.setValue("");
    }

    // eslint-disable-next-line
  }, [
    startTimestampField.value,
    startTimeField.value,
    endTimestampField.value,
    endTimeField.value,
  ]);

  return (
    <div css={fieldStyles.doubleGrid}>
      <p name={fieldName}>{`Elapsed time: ${
        field.value ? field.value : "--"
      } minutes`}</p>
      <FieldError touched errorMessage={meta.error} labelText={fieldName} />
    </div>
  );
};

export default ElapsedTime;
