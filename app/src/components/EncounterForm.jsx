/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useState, Fragment } from "react";
import { Formik, Form } from "formik";
import add from "date-fns/add";
import { navigate } from "@reach/router";

import utilities from "../materials/utilities";
import { constructDateTime } from "../utils/time";
import { getModifiedProperties } from "../utils/math";
import CancelFormConfirmationModal from "../components/CancelFormConfirmationModal";
import Button from "./Button";
import FormSection from "./FormSection";
import ListHeader from "./list/ListHeader";

import TextInput from "./formFields/TextInput/TextInput";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";
import NumberInput from "./formFields/NumberInput/NumberInput";
import DateInput from "./formFields/DateInput/DateInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import ElapsedTime from "./formFields/ElapsedTime/ElapsedTime";
import Select from "./formFields/Select/Select";
import RadioGroup from "./formFields/RadioGroup/RadioGroup";
import InputFocusOnError from "./formFields/InputFocusOnError";

import { THREE_DAYS_IN_HOURS, FormSubmitType } from "../constants/forms";
import area from "../constants/formOptions/area";
import species from "../constants/formOptions/species";
import project from "../constants/formOptions/project";
import cue from "../constants/formOptions/cue";
import vessel from "../constants/formOptions/vessel";
import reasonForLeaving from "../constants/formOptions/reasonForLeaving";
import {
  RESEARCH_ASSISTANT,
  RESEARCH_SCIENTIST,
} from "../constants/formOptions/roles";
import encounterDefaults from "../constants/encounterDefaultValues";
import { generateOpenEncounterURL } from "../constants/routes";

const EncounterForm = ({
  initialValues,
  handleSubmit,
  isViewOnly,
  encounterId,
  autofillEnd,
}) => {
  const [submitType, setSubmitType] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
    endButton: css`
      margin-right: 10px;
    `,
    section: css`
      background-color: none;
    `,
  };

  const transformSubmitValues = (values) => {
    values.startTimestamp.setHours(0, 0, 0, 0);
    if (!!values.endTimestamp) {
      values.endTimestamp.setHours(0, 0, 0, 0);
    }

    values.needsToBeChecked = values.enteredBy === RESEARCH_ASSISTANT;
  };

  const renderConfirmationModal = () => {
    return (
      <CancelFormConfirmationModal
        closeModal={() => setShowConfirmationModal(false)}
        handleLeavePage={() => navigate(generateOpenEncounterURL(encounterId))}
      />
    );
  };

  const initValues = initialValues || encounterDefaults;
  const hasEnded = initialValues ? initialValues.hasEnded : false;

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={initValues}
          onSubmit={(values) => {
            transformSubmitValues(values);
            handleSubmit(submitType, values);
          }}
        >
          {({ values, submitForm }) => (
            <Form>
              <section css={styles.section}>
                <ListHeader title="Encounter details" />
                <FormSection>
                  <TextInput
                    name="sequenceNumber"
                    labelText="Encounter sequence"
                    maxLength={255}
                    isRequired
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="area"
                    labelText="Area"
                    options={area}
                    isRequired
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <br />
              <section css={styles.section}>
                <FormSection>
                  <Select
                    name="species"
                    labelText="Species"
                    options={species}
                    isRequired
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="cue"
                    labelText="Cue"
                    options={cue}
                    isDisabled={isViewOnly}
                  />
                  <TextInput
                    name="location"
                    labelText="Location"
                    maxLength={100}
                    isDisabled={isViewOnly}
                  />
                  <TextInput
                    name="observers"
                    labelText="Observers"
                    maxLength={100}
                    isDisabled={isViewOnly}
                  />
                  <TextAreaInput
                    name="comments"
                    labelText="Comments / Observations (names of underwater observers)"
                    maxLength={1000}
                    isDouble
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <br />
              <section css={styles.section}>
                <FormSection legendText="Number of animals" isOneLine>
                  <NumberInput
                    name="numberOfAnimalsLow"
                    labelText="Low estimate"
                    minValue={0}
                    maxValue={
                      values.numberOfAnimalsBest ||
                      values.numberOfAnimalsHigh ||
                      9999
                    }
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numberOfAnimalsBest"
                    labelText="Best estimate"
                    minValue={0}
                    maxValue={values.numberOfAnimalsHigh || 9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numberOfAnimalsHigh"
                    labelText="High estimate"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <br />
              <section css={styles.section}>
                <FormSection>
                  <Select
                    name="project"
                    labelText="Project"
                    options={project}
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="vessel"
                    labelText="Vessel"
                    options={vessel}
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <section css={styles.section}>
                <ListHeader title="Evidence" />
                <FormSection>
                  <RadioGroup
                    name="biopsyAttempt"
                    labelText="Biopsy attempt"
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="biopsySuccess"
                    labelText="Biopsy success"
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                      { label: "Not noted", value: "not-noted" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection>
                  <RadioGroup
                    name="tagAttempt"
                    labelText="Tag attempt"
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="tagSuccess"
                    labelText="Tag success"
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                      { label: "Not noted", value: "not-noted" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection>
                  <RadioGroup
                    name="transect"
                    labelText="Transect"
                    options={[
                      { label: "On", value: "On" },
                      { label: "Off", value: "Off" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                  <TextInput
                    name="transectNumber"
                    labelText="Transect number"
                    maxLength={8}
                    isShort
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection>
                  <TextInput
                    name="videoRec"
                    labelText="Video rec"
                    maxLength={50}
                    isDisabled={isViewOnly}
                  />
                  <TextInput
                    name="audioRec"
                    labelText="Audio rec"
                    maxLength={255}
                    isDisabled={isViewOnly}
                  />
                  <TextInput
                    name="photographerFrame"
                    labelText="Photographer + Frame"
                    maxLength={255}
                    isDisabled={isViewOnly}
                  />
                  <TextAreaInput
                    name="visualIdentifications"
                    labelText="Visual identifications"
                    maxLength={200}
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <section css={styles.section}>
                <ListHeader title="Age Class" />
                <FormSection legendText="Number of adult" isOneLine>
                  <NumberInput
                    name="numAdultMale"
                    labelText="Male"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numAdultFemale"
                    labelText="Female"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numAdultUnknown"
                    labelText="Unknown"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection legendText="Number of sub adult" isOneLine>
                  <NumberInput
                    name="numSubAdultMale"
                    labelText="Male"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numSubAdultFemale"
                    labelText="Female"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numSubAdult"
                    labelText="Unknown"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection legendText="Number of juvenile" isOneLine>
                  <NumberInput
                    name="numJuvenileMale"
                    labelText="Male"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numJuvenileFemale"
                    labelText="Female"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numJuvenileUnknown"
                    labelText="Unknown"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection legendText="Number of other" isOneLine>
                  <NumberInput
                    name="numYoungOfYear"
                    labelText="Young of year"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numNeonates"
                    labelText="Neonates"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="numUnknown"
                    labelText="Unknown"
                    minValue={0}
                    maxValue={9999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <section css={styles.section}>
                <ListHeader title="Encounter completion" />
                <FormSection>
                  <TextInput
                    name="logbookNumber"
                    labelText="Logbook number"
                    maxLength={20}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <NumberInput
                    name="encounterNumber"
                    labelText="Encounter number"
                    minValue={1}
                    maxValue={999}
                    isShort
                    isInteger
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection>
                  <TimeInput
                    name="highTide"
                    labelText="High tide"
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <TimeInput
                    name="lowTide"
                    labelText="Low tide"
                    isShort
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <FormSection id="dates" errorFieldName="elapsedTime">
                  <DateInput
                    name="startTimestamp"
                    labelText="Start date"
                    isRequired
                    isShort
                    notAfter={new Date()}
                    isDisabled={isViewOnly}
                  />
                  <TimeInput
                    name="startTime"
                    labelText="Start time"
                    isShort
                    notAfter={values.startTimestamp}
                    isRequired
                    isDisabled={isViewOnly}
                  />
                  <DateInput
                    name="endTimestamp"
                    labelText="End date"
                    isShort
                    notBefore={values.startTimestamp}
                    notAfter={add(new Date(values.startTimestamp), {
                      hours: THREE_DAYS_IN_HOURS,
                    })}
                    isDisabled={isViewOnly}
                    autofill={autofillEnd}
                  />
                  <TimeInput
                    name="endTime"
                    labelText="End time"
                    isShort
                    associatedDate={values.endTimestamp}
                    notBefore={constructDateTime(
                      values.startTimestamp,
                      values.startTime
                    )}
                    isDisabled={isViewOnly}
                    autofill={autofillEnd}
                  />
                  <ElapsedTime
                    notAfter={add(
                      constructDateTime(
                        values.startTimestamp,
                        values.startTime
                      ),
                      { hours: THREE_DAYS_IN_HOURS }
                    )}
                  />
                </FormSection>
                <br />
                <FormSection>
                  <TimeInput
                    name="endOfSearchEffort"
                    labelText="End of search effort"
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="reasonForLeaving"
                    labelText="Reason for leaving"
                    options={reasonForLeaving}
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="enteredBy"
                    labelText="Entered by"
                    options={[
                      {
                        label: RESEARCH_ASSISTANT,
                        value: RESEARCH_ASSISTANT,
                      },
                      {
                        label: RESEARCH_SCIENTIST,
                        value: RESEARCH_SCIENTIST,
                      },
                    ]}
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <div css={utilities.form.legend}>
                <span>*</span>required fields
              </div>
              {!isViewOnly && (
                <Fragment>
                  <div css={utilities.sticky.footerContainer}>
                    <div>
                      <Button
                        styles={styles.cancelButton}
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          const modifiedFields = getModifiedProperties(
                            values,
                            initValues
                          );

                          Object.keys(modifiedFields).length === 0
                            ? navigate(generateOpenEncounterURL(encounterId))
                            : setShowConfirmationModal(true);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div css={utilities.sticky.rightContainer}>
                      {!hasEnded && (
                        <Button
                          styles={styles.endButton}
                          width="150px"
                          variant="secondary"
                          type="button"
                          onClick={() => {
                            // Setting state and calling submitForm with timeout is required as passing a payload to
                            // submitForm is not yet supported: https://github.com/BMMRO-tech/BMMRO/issues/132
                            setSubmitType(FormSubmitType.SAVE_AND_END);
                            setTimeout(submitForm);
                          }}
                        >
                          Save & End
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={() => {
                          // Setting state and calling submitForm with timeout is required as passing a payload to
                          // submitForm is not yet supported: https://github.com/BMMRO-tech/BMMRO/issues/132
                          setSubmitType(FormSubmitType.SAVE);
                          setTimeout(submitForm);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <InputFocusOnError />
                </Fragment>
              )}
            </Form>
          )}
        </Formik>
      </div>

      {showConfirmationModal && renderConfirmationModal()}
    </div>
  );
};

export default EncounterForm;
