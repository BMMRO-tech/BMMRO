/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Form, Formik } from "formik";
import { Fragment, useRef, useState } from "react";
import { navigate } from "@reach/router";

import utilities from "../materials/utilities";
import { getModifiedProperties } from "../utils/math";
import CancelFormConfirmationModal from "../components/CancelFormConfirmationModal";
import ListHeader from "./list/ListHeader";
import Button from "./Button";
import FormSection from "./FormSection";

import InputFocusOnError from "./formFields/InputFocusOnError";
import Select from "./formFields/Select/Select";
import TimeInput from "./formFields/TimeInput/TimeInput";

import tripDefaults from "../constants/tripDefaultValues";
import { ROUTES } from "../constants/routes";
import GpsFormSection from "./GpsFormSection";
import logbookDefaultValues from "../constants/logbookDefaultValues";
import NumberWithCheckbox from "./formFields/NumberWithCheckbox/NumberWithCheckbox";
import NumberInput from "./formFields/NumberInput/NumberInput";
import beaufortSeaState from "../constants/formOptions/beaufortSeaState";
import cloudCover from "../constants/formOptions/cloudCover";
import bottomSubstrate from "../constants/formOptions/bottomSubstrate";
import swellWaveHeight from "../constants/formOptions/swellWaveHeight";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";
import RadioGroup from "./formFields/RadioGroup/RadioGroup";
import PositionalValidationModal from "./PositionalValidationModal";

const NewLogbookForm = ({ handleSubmit, initialValues, isViewOnly }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const ref = useRef(null);
  const [closedPositionalModal, setClosedPositionalModal] = useState(false);
  const [showPositionalModal, setShowPositionalModal] = useState({
    boolean: false,
    values: "",
  });

  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
    endButton: css`
      margin-right: 10px;
    `,
  };

  const renderConfirmationModal = () => {
    return (
      <CancelFormConfirmationModal
        closeModal={() => setShowConfirmationModal(false)}
        handleLeavePage={() => navigate(ROUTES.trips)}
      />
    );
  };

  const checkingValidation = (isPositionalData) => {
    setClosedPositionalModal(isPositionalData);
  };

  const isValidPositionalData = (values) =>
    (values.longitude && values.latitude) || values.gpsMark;

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
        pageName="logbook"
      />
    );
  };

  const initValues = initialValues || logbookDefaultValues;

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={initValues}
          innerRef={ref}
          onSubmit={(values) => {
            isValidPositionalData(values)
              ? handleSubmit(values)
              : setShowPositionalModal({ boolean: true, values: values });
          }}
        >
          {({ values }) => (
            <Form>
              <section>
                <ListHeader title="Logbook Details" />
                <ListHeader title="Time & position" />
                <FormSection>
                  <TimeInput
                    name="time"
                    labelText="Time"
                    autofill={true}
                    isRequired
                  />
                </FormSection>
              </section>
              <br />
              <section>
                <GpsFormSection
                  isRenderInfoLabel={closedPositionalModal}
                  initialValues={initialValues}
                  isViewOnly={isViewOnly}
                />
              </section>

              <br />

              <section css={styles.section}>
                <ListHeader title="Environment" />
                <FormSection>
                  <NumberWithCheckbox
                    numberInputName="waterDepth"
                    labelText="Water depth (m)"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    decimalPrecision={3}
                    isDisabled={isViewOnly}
                    checkboxName="waterDepthBeyondSoundings"
                    checkboxLabel="Beyond soundings"
                  />
                  <NumberInput
                    name="waterTemp"
                    labelText="Water temp (°C)"
                    minValue={15}
                    maxValue={40}
                    isShort
                    decimalPrecision={5}
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="bottomSubstrate"
                    labelText="Bottom substrate"
                    options={bottomSubstrate}
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="cloudCover"
                    labelText="Cloud cover"
                    options={cloudCover}
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="beaufortSeaState"
                    labelText="Beaufort sea state"
                    options={beaufortSeaState}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="swellWaveHeight"
                    labelText="Swell / Wave height (ft)"
                    options={swellWaveHeight}
                    isShort
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>

              <section>
                <ListHeader title="Evidence" />
                <FormSection>
                  <RadioGroup
                    name="hydrophoneChecked"
                    labelText="Was there a hydrophone check?"
                    options={[
                      {
                        label: "Yes",
                        value: "Yes",
                      },
                      {
                        label: "No",
                        value: "No",
                      },
                    ]}
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="efforted"
                    labelText="Efforted"
                    options={[
                      {
                        label: "Yes",
                        value: "Yes",
                      },
                      {
                        label: "No",
                        value: "No",
                      },
                    ]}
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>

              <section>
                <ListHeader title="Other observations" />
                <FormSection>
                  <TextAreaInput
                    name="hydrophoneComments"
                    labelText="Hydrophone comments"
                    maxLength={1000}
                    isDisabled={isViewOnly}
                    isDouble
                  />
                  <TextAreaInput
                    name="logbookComments"
                    labelText="Logbook comments"
                    maxLength={1000}
                    isDisabled={isViewOnly}
                    isDouble
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
                        tripDefaults
                      );

                      Object.keys(modifiedFields).length === 0
                        ? navigate(ROUTES.trips)
                        : setShowConfirmationModal(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    styles={styles.endButton}
                    width="200px"
                    type="submit"
                    testId={"saveLogBook"}
                  >
                    Save
                  </Button>
                </div>
                <InputFocusOnError />
              </Fragment>
              <InputFocusOnError
                hasTriedToSubmit={checkingValidation}
                pageHasPositionalValues={true}
              />
            </Form>
          )}
        </Formik>
      </div>

      {showConfirmationModal && renderConfirmationModal()}
      {showPositionalModal.boolean && renderPositionalValidationModal()}
    </div>
  );
};

export default NewLogbookForm;
