/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Form, Formik } from "formik";
import { forwardRef, Fragment, useRef } from "react";

import utilities from "../materials/utilities";
import Button from "./Button";
import FormSection from "./FormSection";

import TimeInput from "./formFields/TimeInput/TimeInput";
import logbookDefaultValues from "../constants/logbookDefaultValues";
import NumberInput from "./formFields/NumberInput/NumberInput";

const LastLogbookForm = ({ handleSubmit, closeModal, tripDate }) => {
  const ref = useRef(null);

  const StayButton = forwardRef((props, ref) => (
    <Button variant="neutral" ref={ref} onClick={closeModal}>
      Stay on this page
    </Button>
  ));
  const styles = {
    warning: css`
      color: red;
    `,
  };

  const initValues = { tripMiles: "", ...logbookDefaultValues };
  const transformSubmitValues = (values) => {
    values.logbookComments = values.tripMiles
      ? "trip miles: " + values.tripMiles
      : "";
  };
  const anotherDay =
    tripDate.getFullYear() < new Date().getFullYear()
      ? true
      : tripDate.getMonth() < new Date().getMonth()
      ? true
      : tripDate.getDate() < new Date().getDate();
  return (
    <div css={utilities.form.container}>
      <Formik
        initialValues={initValues}
        innerRef={ref}
        onSubmit={(values) => {
          transformSubmitValues(values);
          handleSubmit(values);
        }}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values }) => (
          <Form>
            <section>
              <FormSection>
                <TimeInput
                  name="time"
                  labelText="Time"
                  autofill={true}
                  timeWithSeconds
                  isShort
                />
                {anotherDay && (
                  <span css={styles.warning}>
                    You are ending your trip on a different day. Please make
                    sure to put in the correct time.
                  </span>
                )}
              </FormSection>
            </section>
            <br />

            <section>
              <FormSection>
                <NumberInput
                  name="tripMiles"
                  labelText="Trip miles"
                  decimalPrecision={2}
                  maxLength={100}
                  minValue={0}
                />
              </FormSection>
            </section>
            <Fragment>
              <div css={utilities.confirmationModal.modalButtons}>
                <Button
                  data-testid="confirm-end-button"
                  testId="confirmEndButton"
                  variant="primary"
                  type="submit"
                >
                  Save & Continue
                </Button>
                <StayButton />
              </div>
            </Fragment>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LastLogbookForm;
