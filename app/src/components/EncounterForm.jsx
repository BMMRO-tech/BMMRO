/** @jsx jsx */
import { Formik, Form } from "formik";
import { jsx } from "@emotion/core";
import add from "date-fns/add";

import utilities from "../materials/utilities";
import TextInput from "./formFields/TextInput/TextInput";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";
import NumberInput from "./formFields/NumberInput/NumberInput";
import DateInput from "./formFields/DateInput/DateInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import ElapsedTime from "./formFields/ElapsedTime/ElapsedTime";
import Select from "./formFields/Select/Select";
import RadioGroup from "./formFields/RadioGroup/RadioGroup";
import Button from "./Button";

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
import { THREE_DAYS_IN_HOURS } from "../constants/forms";

const EncounterForm = ({ initialValues, handleSubmit }) => {
  const transformSubmitValues = (values) => {
    values.startTimestamp.setHours(0, 0, 0, 0);
    values.endTimestamp.setHours(0, 0, 0, 0);

    values.needsToBeChecked = values.enteredBy === RESEARCH_ASSISTANT;
  };

  const calculateDateTime = (date, time) => {
    return new Date(date).setHours(time.split(":")[0], time.split(":")[1]);
  };

  return (
    <div css={utilities.sticky.contentContainer}>
      <h1 css={utilities.form.title}>New Encounter</h1>
      <div css={utilities.form.container}>
        <Formik
          initialValues={
            initialValues || {
              sequenceNumber: "",
              startTimestamp: "",
              area: "",
              species: "",
              project: "",
              cue: "",
              vessel: "",
              observers: "",
              groupSize: "",
              location: "",
              comments: "",
              videoRec: "",
              audioRec: "",
              photographerFrame: "",
              visualIdentifications: "",
              biopsyAttempt: "No",
              biopsySuccess: "not-noted",
              tagAttempt: "No",
              tagSuccess: "not-noted",
              transect: "Off",
              numAdultMale: "",
              numAdultFemale: "",
              numAdultUnknown: "",
              numSubAdultMale: "",
              numSubAdultFemale: "",
              numSubAdult: "",
              numJuvenileMale: "",
              numJuvenileFemale: "",
              numJuvenileUnknown: "",
              numYoungOfYear: "",
              numNeonates: "",
              numUnknown: "",
              endOfSearchEffort: "",
              endTimestamp: "",
              endTime: "",
              reasonForLeaving: "",
              highTide: "",
              lowTide: "",
              logbookNumber: "",
              encounterNumber: "",
              startTime: "",
              elapsedTime: "",
              enteredBy: RESEARCH_ASSISTANT,
              exported: false,
            }
          }
          onSubmit={(values) => {
            transformSubmitValues(values);
            handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              <div css={utilities.form.fieldsGrid}>
                <DateInput
                  name="startTimestamp"
                  labelText="Date"
                  isRequired
                  isShort
                  notAfter={new Date()}
                  autofill={!initialValues}
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
                <Select
                  name="species"
                  labelText="Species"
                  options={species}
                  isRequired
                />
                <Select name="project" labelText="Project" options={project} />
                <Select name="cue" labelText="Cue" options={cue} />
                <Select name="vessel" labelText="Vessel" options={vessel} />
                <TextInput
                  name="observers"
                  labelText="Observers"
                  maxLength={100}
                />
                <NumberInput
                  name="groupSize"
                  labelText="Group size (visual)"
                  minValue={1}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <TextInput
                  name="location"
                  labelText="Location"
                  maxLength={100}
                />
                <TextAreaInput
                  name="comments"
                  labelText="Comments / Observations (names of underwater observers)"
                  maxLength={500}
                />
                <TextInput
                  name="videoRec"
                  labelText="Video rec"
                  maxLength={50}
                />
                <TextInput
                  name="audioRec"
                  labelText="Audio rec"
                  maxLength={255}
                />
                <TextInput
                  name="photographerFrame"
                  labelText="Photographer + Frame"
                  maxLength={255}
                />
                <TextAreaInput
                  name="visualIdentifications"
                  labelText="Visual identifications"
                  maxLength={200}
                />
                <RadioGroup
                  name="biopsyAttempt"
                  labelText="Biopsy attempt"
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                />
                <RadioGroup
                  name="biopsySuccess"
                  labelText="Biopsy success"
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                    { label: "Not noted", value: "not-noted" },
                  ]}
                />
                <RadioGroup
                  name="tagAttempt"
                  labelText="Tag attempt"
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                />
                <RadioGroup
                  name="tagSuccess"
                  labelText="Tag success"
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                    { label: "Not noted", value: "not-noted" },
                  ]}
                />
                <RadioGroup
                  name="transect"
                  labelText="Transect"
                  options={[
                    { label: "On", value: "On" },
                    { label: "Off", value: "Off" },
                  ]}
                />
                <TextInput
                  name="transectNumber"
                  labelText="Transect number"
                  maxLength={8}
                  isShort
                />
                <NumberInput
                  name="numAdultMale"
                  labelText="Number of adult male"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numAdultFemale"
                  labelText="Number of adult female"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numAdultUnknown"
                  labelText="Number of adult unknown"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numSubAdultMale"
                  labelText="Number of sub adult male"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numSubAdultFemale"
                  labelText="Number of sub adult female"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numSubAdult"
                  labelText="Number of sub adult"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numJuvenileMale"
                  labelText="Number of juvenile male"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numJuvenileFemale"
                  labelText="Number of juvenile female"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numJuvenileUnknown"
                  labelText="Number of juvenile unknown"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numYoungOfYear"
                  labelText="Number of young of year"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numNeonates"
                  labelText="Number of neonates"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <NumberInput
                  name="numUnknown"
                  labelText="Number of unknown"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <TimeInput
                  name="endOfSearchEffort"
                  labelText="End of search effort"
                  isShort
                />
                <DateInput
                  name="endTimestamp"
                  labelText="End date"
                  isShort
                  autofill={!initialValues}
                  notBefore={values.startTimestamp}
                  notAfter={add(new Date(values.startTimestamp), {
                    hours: THREE_DAYS_IN_HOURS,
                  })}
                />
                <TimeInput
                  name="endTime"
                  labelText="End time"
                  isShort
                  associatedDate={values.endTimestamp}
                  notBefore={calculateDateTime(
                    values.startTimestamp,
                    values.startTime
                  )}
                  notAfter={add(
                    calculateDateTime(values.startTimestamp, values.startTime),
                    { hours: THREE_DAYS_IN_HOURS }
                  )}
                />
                <Select
                  name="reasonForLeaving"
                  labelText="Reason for leaving"
                  options={reasonForLeaving}
                />
                <TimeInput name="highTide" labelText="High tide" isShort />
                <TimeInput name="lowTide" labelText="Low tide" isShort />
                <TextInput
                  name="logbookNumber"
                  labelText="Logbook number"
                  maxLength={20}
                  isShort
                />
                <NumberInput
                  name="encounterNumber"
                  labelText="Encounter number"
                  minValue={1}
                  maxValue={999}
                  isShort
                  isInteger
                />
                <TimeInput
                  name="startTime"
                  labelText="Start time"
                  isShort
                  autofill={!initialValues}
                  notAfter={values.startTimestamp}
                />
                <ElapsedTime />
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
                />
              </div>
              <div css={utilities.form.legend}>
                <span>*</span>required fields
              </div>
              <div css={utilities.sticky.footerContainer}>
                <Button type="submit">Save encounter</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EncounterForm;
