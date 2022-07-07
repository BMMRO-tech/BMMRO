/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { Formik, Form } from "formik";
import utilities from "../materials/utilities";
import Button from "./Button";
import FormSection from "./FormSection";
import ListHeader from "./list/ListHeader";
import biopsyFormDefaults from "../constants/biopsyFormDefaultValues";
import DateInput from "./formFields/DateInput/DateInput";
import TextInput from "./formFields/TextInput/TextInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import Select from "./formFields/Select/Select";
import species from "../constants/formOptions/species";
import { generateOpenEncounterURL } from "../constants/routes";
import GpsFormSection from "./GpsFormSection";
import InputFocusOnError from "./formFields/InputFocusOnError";
import { useState } from "react";
import PositionalValidationModal from "./PositionalValidationModal";

const BiopsyForm = ({ initialValues, handleSubmit, encounterId }) => {
  const [closedPositionalModal, setClosedPositionalModal] = useState(false);
  const [showPositionalModal, setShowPositionalModal] = useState({
    boolean: false,
    values: "",
  });
  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
    section: css`
      background-color: none;
    `,
  };
  const checkingValidation = (isPositionalData) => {
    setClosedPositionalModal(isPositionalData);
  };

  const initValues = initialValues || biopsyFormDefaults;

  const renderPositionalValidationModal = () => {
    return (
      <PositionalValidationModal
        closeModal={() => {
          const elementValue = document.getElementsByName("latitude")[0];
          window.setTimeout(() => elementValue.focus(), 0);
          setShowPositionalModal((prevState) => {
            return {
              ...prevState,
              boolean: false,
            };
          });
        }}
        handleLeavePage={() => handleSubmit(showPositionalModal.values)}
        pageName="biopsy"
      />
    );
  };

  const isValidPositionalData = (values) =>
    (values.longitude && values.latitude) || values.gpsMark;

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={initValues}
          onSubmit={(values) => {
            isValidPositionalData(values)
              ? handleSubmit(values)
              : setShowPositionalModal({ boolean: true, values: values });
          }}
        >
          {({ values }) => (
            <Form>
              <section css={styles.section}>
                <ListHeader title="Time & position" />
                <FormSection>
                  <DateInput
                    name="dateTaken"
                    labelText="Date"
                    isRequired
                    isShort
                    notAfter={new Date()}
                    autofill={true}
                  />
                  <TimeInput
                    name="timeTaken"
                    labelText="Time"
                    isShort
                    autofill={true}
                    timeWithSeconds
                    isRequired
                  />
                </FormSection>
                <br />
                <GpsFormSection isRenderInfoLabel={closedPositionalModal} />
                <ListHeader title="Biopsy details" />
                <FormSection>
                  <Select
                    name="species"
                    labelText="Species"
                    options={species}
                    isRequired
                    isDisabled={false}
                  />

                  <TextInput
                    name="attempt"
                    labelText="Attempt Number"
                    maxLength={255}
                    isShort
                  />
                  <TextInput
                    name="samplerName"
                    labelText="Sampler Name"
                    maxLength={255}
                    isShort
                  />
                  <TextInput
                    name="totalSpecimens"
                    labelText="Total Specimens"
                    maxLength={255}
                    isShort
                  />
                </FormSection>
              </section>
              <div css={utilities.sticky.footerContainer}>
                <Link to={generateOpenEncounterURL(encounterId)}>
                  <Button
                    styles={styles.cancelButton}
                    variant="secondary"
                    testId={"cancelBiopsy"}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" testId={"saveBiopsy"}>
                  Save
                </Button>
              </div>
              <InputFocusOnError
                hasTriedToSubmit={checkingValidation}
                isPageNewHabitatUse={true}
              />
            </Form>
          )}
        </Formik>
      </div>

      {showPositionalModal.boolean && renderPositionalValidationModal()}
    </div>
  );
};

export default BiopsyForm;
