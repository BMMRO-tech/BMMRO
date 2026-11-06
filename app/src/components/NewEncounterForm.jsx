/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { Form, Formik } from "formik";
import { useState, Fragment } from "react";
import { navigate } from "@reach/router";

import utilities from "../materials/utilities";
import { getModifiedProperties } from "../utils/math";
import ConfirmationModal from "../components/ConfirmationModal";
import ListHeader from "./list/ListHeader";
import Button from "./Button";
import FormSection from "./FormSection";

import DateInput from "./formFields/DateInput/DateInput";
import InputFocusOnError from "./formFields/InputFocusOnError";
import Select from "./formFields/Select/Select";
import TextInput from "./formFields/TextInput/TextInput";
import TimeInput from "./formFields/TimeInput/TimeInput";

import area from "../constants/formOptions/area";
import encounterDefaults from "../constants/encounterDefaultValues";
import { ROUTES } from "../constants/routes";

const NewEncounterForm = ({ handleSubmit }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
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

  const renderConfirmationModal = () => {
    return (
      <ConfirmationModal
        title="Leave without saving changes?"
        description="Any changes made to this form will be lost."
        confirmLabel="Leave"
        cancelLabel="Stay on this page"
        onConfirm={() => navigate(ROUTES.encounters)}
        onCancel={() => setShowConfirmationModal(false)}
        testId="cancel-confirmation-modal"
      />
    );
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
              <section>
                <ListHeader title="Encounter details" />
                <FormSection>
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
                </FormSection>
              </section>
              <div css={utilities.form.legend}>
                <span>*</span>required fields
              </div>

              <Fragment>
                <div css={utilities.sticky.footerContainer}>
                  <Button
                    styles={styles.cancelButton}
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      const modifiedFields = getModifiedProperties(
                        values,
                        encounterDefaults,
                      );

                      Object.keys(modifiedFields).length === 0
                        ? navigate(ROUTES.encounters)
                        : setShowConfirmationModal(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    styles={styles.endButton}
                    width="200px"
                    type="submit"
                    testId={"newHabitat"}
                  >
                    + New Habitat Use
                  </Button>
                </div>
                <InputFocusOnError />
              </Fragment>
            </Form>
          )}
        </Formik>
      </div>

      {showConfirmationModal && renderConfirmationModal()}
    </div>
  );
};

export default NewEncounterForm;
