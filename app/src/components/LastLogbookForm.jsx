/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Form, Formik } from "formik";
import { forwardRef, Fragment } from "react";

import utilities from "../materials/utilities";
import Button from "./Button";
import FormSection from "./FormSection";

import TimeInput from "./formFields/TimeInput/TimeInput";
import logbookDefaultValues from "../constants/logbookDefaultValues";
import NumberInput from "./formFields/NumberInput/NumberInput";
import Attention from "../components/icons/Attention";
import { getCurrentDate } from "../utils/time";

const LastLogbookForm = ({ handleSubmit, closeModal, tripDate }) => {
  const CancelButton = forwardRef((props, ref) => (
    <Button variant="neutral" ref={ref} onClick={closeModal}>
      Cancel
    </Button>
  ));
  const styles = {
    warning: css`
      color: darkRed;
    `,
  };

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

  const initValues = {
    tripMiles: "",
    ...logbookDefaultValues,
    time: getCurrentDate().getTime(),
  };
  return (
    <div css={utilities.form.container}>
      <Formik
        initialValues={initValues}
        onSubmit={(values) => {
          transformSubmitValues(values);
          handleSubmit(values);
        }}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values }) => {
          return (
            <Form>
              <section>
                <FormSection>
                  <TimeInput
                    name="time"
                    labelText="Time"
                    autofill={true}
                    timeWithSeconds
                  />
                  {anotherDay && (
                    <span css={styles.warning}>
                      <div>
                        <Attention />
                      </div>
                      <div>
                        You are ending your trip on a different day. Please make
                        sure to put in the correct time.
                      </div>
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
                  <CancelButton />
                  <Button
                    data-testid="confirm-end-button"
                    testId="confirmEndButton"
                    variant="primary"
                    type="submit"
                  >
                    Save & Continue
                  </Button>
                </div>
              </Fragment>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LastLogbookForm;
