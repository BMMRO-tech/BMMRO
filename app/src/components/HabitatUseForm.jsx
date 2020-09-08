/** @jsx jsx */
import { useState } from "react";
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import { navigate } from "@reach/router";

import utilities from "../materials/utilities";
import { getModifiedProperties } from "../utils/math";
import CancelFormConfirmationModal from "../components/CancelFormConfirmationModal";
import Button from "./Button";

import NumberInput from "./formFields/NumberInput/NumberInput";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";
import TextInput from "./formFields/TextInput/TextInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import PositionInput from "./formFields/PositionInput/PositionInput";
import Select from "./formFields/Select/Select";
import InputFocusOnError from "./formFields/InputFocusOnError";

import direction from "../constants/formOptions/direction";
import bottomSubstrate from "../constants/formOptions/bottomSubstrate";
import cloudCover from "../constants/formOptions/cloudCover";
import beaufortSeaState from "../constants/formOptions/beaufortSeaState";
import tideState from "../constants/formOptions/tideState";
import behaviour from "../constants/formOptions/behaviour";
import swellWaveHeight from "../constants/formOptions/swellWaveHeight";
import groupCohesion from "../constants/formOptions/groupCohesion";
import { generateOpenEncounterURL } from "../constants/routes";
import habitatUseDefaults from "../constants/habitatUseDefaultValues";

const HabitatUseForm = ({
  initialValues,
  handleSubmit,
  isViewOnly,
  encounterId,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
  };

  const renderConfirmationModal = () => {
    return (
      <CancelFormConfirmationModal
        closeModal={() => setShowConfirmationModal(false)}
        handleLeavePage={() => navigate(generateOpenEncounterURL(encounterId))}
      />
    );
  };

  const initValues = initialValues || habitatUseDefaults;

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik initialValues={initValues} onSubmit={handleSubmit}>
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
                  isShort
                  autofill={!initialValues}
                  isDisabled={isViewOnly}
                />
                <PositionInput
                  name="longitude"
                  type="longitude"
                  labelText="Long"
                  isShort
                  autofill={!initialValues}
                  isDisabled={isViewOnly}
                />
                <TextInput
                  name="gpsMark"
                  labelText="GPS mark"
                  maxLength={10}
                  isShort
                  isDisabled={isViewOnly}
                />
              </div>
              <div css={utilities.form.legend}>
                <span>*</span>required fields
              </div>

              {!isViewOnly && (
                <div css={utilities.sticky.footerContainer}>
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
                  <Button type="submit">Save</Button>
                </div>
              )}

              <InputFocusOnError />
            </Form>
          )}
        </Formik>
      </div>

      {showConfirmationModal && renderConfirmationModal()}
    </div>
  );
};

export default HabitatUseForm;
