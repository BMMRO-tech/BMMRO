/** @jsx jsx */
import { useEffect, useState } from "react";
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
import NumberWithCheckbox from "./formFields/NumberWithCheckbox/NumberWithCheckbox";
import ListHeader from "./list/ListHeader";
import FormSection from "./FormSection";
import PositionalValidationModal from "./PositionalValidationModal";
import fieldStyles from "./formFields/fieldStyles";
import { getPosition } from "./formFields/PositionInput/getPosition";

import { Refresh } from "./icons/Refresh";

const HabitatUseForm = ({
  initialValues,
  handleSubmit,
  isViewOnly,
  encounterId,
  pageHasPositionalValues,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPositionalModal, setShowPositionalModal] = useState({
    boolean: false,
    values: "",
  });
  const [closedPositionalModal, setClosedPositionalModal] = useState(false);
  const [refreshLatLong, setRefreshLatLong] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ latitude: "", longitude: "" });
  const [error, setError] = useState(null);

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

  useEffect(() => {
    (async () => {
      const tempPosition = await getPosition();

      if (tempPosition.position !== null) {
        setPosition(tempPosition.position);
      }
      setError(tempPosition.error);
      setIsLoading(false);
    })();
  }, [refreshLatLong]);

  const renderConfirmationModal = () => {
    return (
      <CancelFormConfirmationModal
        closeModal={() => setShowConfirmationModal(false)}
        handleLeavePage={() => navigate(generateOpenEncounterURL(encounterId))}
      />
    );
  };

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
        pageName="habitat"
      />
    );
  };

  const initValues = initialValues || habitatUseDefaults;

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={initValues}
          async
          onSubmit={(values) => {
            values.hasEnded ||
            (values.longitude && values.latitude) ||
            values.gpsMark
              ? handleSubmit(values)
              : setShowPositionalModal({ boolean: true, values: values });
          }}
        >
          {({ values }) => (
            <Form>
              <section css={styles.section}>
                <ListHeader title="Time & position" />
                <FormSection>
                  <TimeInput
                    name="startTime"
                    labelText="Start time (hh:mm:ss)"
                    isRequired
                    isShort
                    autofill={!initialValues}
                    timeWithSeconds
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
                </FormSection>
                <br />
                <FormSection isOneLine4Elements>
                  <PositionInput
                    name="latitude"
                    type="latitude"
                    labelText="Lat"
                    isShort
                    autofill={!initialValues || refreshLatLong !== 0}
                    isDisabled={isViewOnly}
                    position={position?.latitude}
                  />

                  <div style={{ display: "flex" }}>
                    <PositionInput
                      name="longitude"
                      type="longitude"
                      labelText="Long"
                      isShort
                      autofill={!initialValues || refreshLatLong !== 0}
                      isDisabled={isViewOnly}
                      position={position?.longitude}
                    />
                    {!isViewOnly && (
                      <Refresh
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        setRefreshLatLong={setRefreshLatLong}
                        refreshLatLong={refreshLatLong}
                        testId="Refresh"
                      />
                    )}
                  </div>
                  <TextInput
                    name="gpsMark"
                    labelText="GPS mark"
                    maxLength={10}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  {closedPositionalModal && (
                    <label
                      css={fieldStyles.longRequired}
                      data-testid={"positional-data-validation"}
                    >
                      {" "}
                      Please add either latitude and longitude, or a GPS mark.{" "}
                    </label>
                  )}
                  {error && (
                    <label
                      css={fieldStyles.longRequired}
                      data-testid={"refreshError"}
                    >
                      {" "}
                      Geolocation could not be retrieved.{" "}
                    </label>
                  )}
                </FormSection>
              </section>
              <section css={styles.section}>
                <ListHeader title="Observation" />
                <FormSection>
                  <NumberInput
                    name="numberOfAnimals"
                    labelText="Number of animals"
                    minValue={0}
                    maxValue={999}
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
                    maxLength={1000}
                    isDisabled={isViewOnly}
                    isDouble
                  />
                  <TextAreaInput
                    name="groupComposition"
                    labelText="Group composition"
                    maxLength={255}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="groupCohesion"
                    labelText="Group cohesion"
                    options={groupCohesion}
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name="behaviour"
                    labelText="Behaviour"
                    options={behaviour}
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
                </FormSection>
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
                  <Select
                    name="tideState"
                    labelText="Tide state"
                    options={tideState}
                    isShort
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <br />
              <section css={styles.section}>
                <FormSection isOneLine>
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
                </FormSection>
              </section>
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
                  <Button type="submit" testId={"saveHabitat"}>
                    {!!initialValues ? "Save" : "End Habitat"}
                  </Button>
                </div>
              )}

              <InputFocusOnError
                hasTriedToSubmit={checkingValidation}
                pageHasPositionalValues={pageHasPositionalValues}
              />
            </Form>
          )}
        </Formik>
      </div>

      {showPositionalModal.boolean && renderPositionalValidationModal()}
      {showConfirmationModal && renderConfirmationModal()}
    </div>
  );
};

export default HabitatUseForm;
