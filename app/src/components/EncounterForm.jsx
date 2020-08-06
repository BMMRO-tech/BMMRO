/** @jsx jsx */
import { useContext } from "react";
import { Formik, Form } from "formik";
import { navigate } from "@reach/router";
import { jsx } from "@emotion/core";

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
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import clientPersistence from "../clientPersistence/clientPersistence";
import { ROUTES } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";

import area from "../constants/formOptions/area";
import species from "../constants/formOptions/species";
import project from "../constants/formOptions/project";
import cue from "../constants/formOptions/cue";
import vessel from "../constants/formOptions/vessel";
import reasonForLeaving from "../constants/formOptions/reasonForLeaving";

const EncounterForm = () => {
  const { datastore } = useContext(FirebaseContext);

  const RESEARCH_ASSISTANT = "Research Assistant";
  const RESEARCH_SCIENTIST = "Research Scientist";

  const handleSubmit = (values) => {
    values.startTimestamp.setHours(0, 0, 0, 0);
    values.needsToBeChecked = values.enteredBy === RESEARCH_ASSISTANT;

    const path = datastore.createDoc(CollectionNames.ENCOUNTER, values);
    clientPersistence.set("openEncounterPath", path);
    navigate(ROUTES.openEncounter);
  };

  return (
    <div css={utilities.sticky.contentContainer}>
      <h1 css={utilities.form.title}>New Encounter</h1>
      <div css={utilities.form.container}>
        <Formik
          initialValues={{
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
            photographerFrameNumber: "",
            visualIdentifications: "",
            biopsyAttempt: "no",
            biopsySuccess: "not-noted",
            tagAttempt: "no",
            tagSuccess: "not-noted",
            transect: "off",
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
            endTime: "",
            reasonForLeaving: "",
            highTide: "",
            lowTide: "",
            logbookNumber: "",
            encounterNumber: "",
            startTime: "",
            elapsedTime: "",
            enteredBy: RESEARCH_ASSISTANT,
          }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <div css={utilities.form.fieldsGrid}>
                <DateInput
                  name="startTimestamp"
                  labelText="Date"
                  isRequired
                  isShort
                  autofill
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
                  maxLength={255}
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
                  maxLength={255}
                />
                <TextInput
                  name="audioRec"
                  labelText="Audio rec"
                  maxLength={255}
                />
                <NumberInput
                  name="photographerFrameNumber"
                  labelText="Photographer-frame number"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  isInteger
                />
                <TextAreaInput
                  name="visualIdentifications"
                  labelText="Visual identifications"
                  maxLength={255}
                />
                <RadioGroup
                  name="biopsyAttempt"
                  labelText="Biopsy attempt"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                />
                <RadioGroup
                  name="biopsySuccess"
                  labelText="Biopsy success"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "Not noted", value: "not-noted" },
                  ]}
                />
                <RadioGroup
                  name="tagAttempt"
                  labelText="Tag attempt"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                />
                <RadioGroup
                  name="tagSuccess"
                  labelText="Tag success"
                  options={[
                    { label: "On", value: "on" },
                    { label: "Off", value: "off" },
                    { label: "Not noted", value: "not-noted" },
                  ]}
                />
                <RadioGroup
                  name="transect"
                  labelText="Transect"
                  options={[
                    { label: "On", value: "on" },
                    { label: "Off", value: "off" },
                  ]}
                />
                <TextInput
                  name="transectNumber"
                  labelText="Transect number"
                  maxLength={50}
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
                <TimeInput
                  name="endTime"
                  labelText="End time"
                  isShort
                  notBefore={values.startTime}
                  notAfter={values.startTimestamp}
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
                  maxLength={50}
                  isShort
                />
                <NumberInput
                  name="encounterNumber"
                  labelText="Encounter number"
                  minValue={1}
                  maxValue={9999}
                  isShort
                />
                <TimeInput
                  name="startTime"
                  labelText="Start time"
                  isShort
                  autofill
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
