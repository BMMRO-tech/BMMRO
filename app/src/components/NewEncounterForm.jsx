/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Form, Formik } from "formik";
import { Fragment } from "react";

import area from "../constants/formOptions/area";
import utilities from "../materials/utilities";
import Button from "./Button";
import DateInput from "./formFields/DateInput/DateInput";
import InputFocusOnError from "./formFields/InputFocusOnError";
import Select from "./formFields/Select/Select";
import TextInput from "./formFields/TextInput/TextInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import encounterDefaults from "../constants/encounterDefaultValues";
import ListHeader from "./list/ListHeader";

const NewEncounterForm = ({ handleSubmit }) => {
  const styles = {
    endButton: css`
      margin-right: 10px;
    `,
  };

  const transformSubmitValues = (values) => {
    values.startTimestamp.setHours(0, 0, 0, 0);
    if (values.endTimestamp) {
      values.endTimestamp.setHours(0, 0, 0, 0);
    }
  };

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={encounterDefaults}
          onSubmit={(values) => {
            transformSubmitValues(values);
            handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              <ListHeader title="Encounter details">
                <div
                  css={[utilities.form.subsection, utilities.form.fieldsGrid]}
                >
                  <DateInput
                    name="startTimestamp"
                    labelText="Date"
                    isRequired
                    isShort
                    notAfter={new Date()}
                    autofill={true}
                  />
                  <TextInput
                    name="sequenceNumber"
                    labelText="Encounter sequence"
                    maxLength={255}
                    isRequired
                    isShort
                  />
                  <Select
                    name="area"
                    labelText="Area"
                    options={area}
                    isRequired
                  />
                  <TimeInput
                    name="startTime"
                    labelText="Start time"
                    isShort
                    autofill={true}
                    notAfter={values.startTimestamp}
                    isRequired
                  />
                </div>
              </ListHeader>
              <div css={utilities.form.legend}>
                <span>*</span>required fields
              </div>

              <Fragment>
                <div css={utilities.sticky.footerContainer}>
                  <Button styles={styles.endButton} width="200px" type="submit">
                    + New Habitat Use
                  </Button>
                </div>
                <InputFocusOnError />
              </Fragment>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewEncounterForm;
