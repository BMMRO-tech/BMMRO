/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import { useField } from "formik";

import { TIME_PATTERN } from "../../../constants/forms";
import { constructDateTime } from "../../../utils/time";

const timeStringValid = (val) => {
  const timePattern = new RegExp(TIME_PATTERN);
  return timePattern.test(val);
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

  return field.value ? <p>{`Elapsed time: ${field.value} minutes`}</p> : null;
};

export default ElapsedTime;
