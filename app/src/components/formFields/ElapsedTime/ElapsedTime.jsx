/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, Fragment } from "react";
import { useField } from "formik";

import NumberInput from "../NumberInput/NumberInput";
import { TIME_PATTERN } from "../../../constants/forms";

const timeStringToMinutes = (time) => {
  const [hours, mins] = time.match(/\d{2}/g);
  return Number(hours) * 60 + Number(mins);
};

const timeStringValid = (val) => {
  const timePattern = new RegExp(TIME_PATTERN);
  return timePattern.test(val);
};

const ElapsedTime = () => {
  const [field, , helpers] = useField("elapsedTime");
  const [startTimeField] = useField("startTime");
  const [endTimeField] = useField("endTime");

  useEffect(() => {
    if (
      timeStringValid(startTimeField.value) &&
      timeStringValid(endTimeField.value)
    ) {
      const startTime = timeStringToMinutes(startTimeField.value);
      const endTime = timeStringToMinutes(endTimeField.value);

      if (endTime - startTime >= 0) helpers.setValue(endTime - startTime);
    }
    // eslint-disable-next-line
  }, [startTimeField.value, endTimeField.value]);
  return (
    <Fragment>
      <NumberInput
        {...field}
        name="elapsedTime"
        labelText="Elapsed time (mins)"
        isShort
        isInteger
      />
    </Fragment>
  );
};

export default ElapsedTime;
