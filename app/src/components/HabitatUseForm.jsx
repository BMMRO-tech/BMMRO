/** @jsx jsx */
import { Formik, Form } from "formik";
import { jsx } from "@emotion/core";

import NumberInput from "./formFields/NumberInput/NumberInput";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import PositionInput from "./formFields/PositionInput/PositionInput";
import Select from "./formFields/Select/Select";
import Button from "./Button";
import InputFocusOnError from "./formFields/InputFocusOnError";

import direction from "../constants/formOptions/direction";
import bottomSubstrate from "../constants/formOptions/bottomSubstrate";
import cloudCover from "../constants/formOptions/cloudCover";
import beaufortSeaState from "../constants/formOptions/beaufortSeaState";
import tideState from "../constants/formOptions/tideState";
import behaviour from "../constants/formOptions/behaviour";
import swellWaveHeight from "../constants/formOptions/swellWaveHeight";
import groupCohesion from "../constants/formOptions/groupCohesion";
import utilities from "../materials/utilities";

const HabitatUseForm = ({ initialValues, handleSubmit, isViewOnly }) => {
  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={
            initialValues || {
              numberOfAnimals: 1,
              numberOfCalves: "",
              numberOfBoats: 1,
              directionOfTravel: "",
              comments: "",
              waterDepth: "",
              waterTemp: "",
              bottomSubstrate: "",
              cloudCover: "",
              beaufortSeaState: "",
              tideState: "",
              behaviour: "",
              swellWaveHeight: "",
              distance: "",
              bearing: "",
              aspect: "",
              groupCohesion: "",
              groupComposition: "",
              surfaceBout: 0,
              endTime: "",
              startTime: "",
              latitude: "0",
              longitude: "0",
              exported: false,
            }
          }
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <div css={utilities.form.fieldsGrid}>
                <NumberInput
                  name="numberOfAnimals"
                  labelText="Number of animals"
                  minValue={0}
                  maxValue={99}
                  isInteger
                  isShort
                  isDisabled={isViewOnly}
                />
                <NumberInput
                  name="numberOfCalves"
                  labelText="Number of calves"
                  minValue={0}
                  maxValue={99}
                  isInteger
                  isShort
                  isDisabled={isViewOnly}
                />
                <NumberInput
                  name="numberOfBoats"
                  labelText="Number of boats"
                  minValue={0}
                  maxValue={999}
                  isInteger
                  isShort
                  isDisabled={isViewOnly}
                />
                <Select
                  name="directionOfTravel"
                  labelText="Direction of travel"
                  options={direction}
                  isShort
                  isDisabled={isViewOnly}
                />
                <TextAreaInput
                  name="comments"
                  labelText="Comments"
                  maxLength={500}
                  isDisabled={isViewOnly}
                />
                <NumberInput
                  name="waterDepth"
                  labelText="Water depth (m)"
                  minValue={0}
                  maxValue={9999}
                  isShort
                  decimalPrecision={3}
                  isDisabled={isViewOnly}
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
                  name="tideState"
                  labelText="Tide state"
                  options={tideState}
                  isShort
                  isDisabled={isViewOnly}
                />
                <Select
                  name="behaviour"
                  labelText="Behaviour"
                  options={behaviour}
                  isDisabled={isViewOnly}
                />
                <Select
                  name="swellWaveHeight"
                  labelText="Swell / Wave height (ft)"
                  options={swellWaveHeight}
                  isShort
                  isDisabled={isViewOnly}
                />
                <NumberInput
                  name="distance"
                  labelText="Distance (m)"
                  minValue={0}
                  maxValue={9999}
                  isInteger
                  isShort
                  isDisabled={isViewOnly}
                />
                <NumberInput
                  name="bearing"
                  labelText="Bearing (°)"
                  minValue={0}
                  maxValue={360}
                  isInteger
                  isShort
                  isDisabled={isViewOnly}
                />
                <NumberInput
                  name="aspect"
                  labelText="Aspect (°)"
                  minValue={0}
                  maxValue={360}
                  isInteger
                  isShort
                  isDisabled={isViewOnly}
                />
                <Select
                  name="groupCohesion"
                  labelText="Group cohesion"
                  options={groupCohesion}
                  isDisabled={isViewOnly}
                />
                <TextAreaInput
                  name="groupComposition"
                  labelText="Group composition"
                  maxLength={255}
                  isShort
                  isDisabled={isViewOnly}
                />
                <NumberInput
                  name="surfaceBout"
                  labelText="Surface bout"
                  minValue={0}
                  maxValue={99}
                  isShort
                  decimalPrecision={5}
                  isDisabled={isViewOnly}
                />
                <TimeInput
                  name="endTime"
                  labelText="End time (hh:mm:ss)"
                  notBefore={values.startTime}
                  isShort
                  timeWithSeconds
                  isDisabled={isViewOnly}
                />
                <TimeInput
                  name="startTime"
                  labelText="Start time (hh:mm:ss)"
                  isRequired
                  isShort
                  autofill={!initialValues}
                  timeWithSeconds
                  isDisabled={isViewOnly}
                />
                <PositionInput
                  name="latitude"
                  type="latitude"
                  labelText="Lat"
                  isRequired
                  isShort
                  autofill={!initialValues}
                  isDisabled={isViewOnly}
                />
                <PositionInput
                  name="longitude"
                  type="longitude"
                  labelText="Long"
                  isRequired
                  isShort
                  autofill={!initialValues}
                  isDisabled={isViewOnly}
                />
              </div>
              <div css={utilities.form.legend}>
                <span>*</span>required fields
              </div>
              <div css={utilities.sticky.footerContainer}>
                {!isViewOnly && <Button type="submit">Save habitat use</Button>}
              </div>
              <InputFocusOnError />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default HabitatUseForm;
