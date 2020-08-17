/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, Fragment } from "react";
import { useField } from "formik";

import NumberInput from "../NumberInput/NumberInput";
import { TIME_PATTERN } from "../../../constants/forms";

const timeStringValid = (val) => {
  const timePattern = new RegExp(TIME_PATTERN);
  return timePattern.test(val);
};

const constructDateTime = (date, time) => {
  return new Date(date).setHours(time.split(":")[0], time.split(":")[1]);
};

const ElapsedTime = () => {
  const [field, , helpers] = useField("elapsedTime");
  const [startTimestampField] = useField("startTimestamp");
  const [startTimeField] = useField("startTime");
  const [endTimestampField] = useField("endTimestamp");
  const [endTimeField] = useField("endTime");

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
    }
    // eslint-disable-next-line
  }, [
    startTimestampField.value,
    startTimeField.value,
    endTimestampField.value,
    endTimeField.value,
  ]);
  return (
    <Fragment>
      <NumberInput
        {...field}
        name="elapsedTime"
        labelText="Elapsed time (mins)"
        minValue={0}
        maxValue={4320}
        isShort
        isInteger
      />
    </Fragment>
  );
};

export default ElapsedTime;
