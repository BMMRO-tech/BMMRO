/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { Formik, Form } from "formik";
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
import utilities from "../materials/utilities";
import DartHitSection from "./DartHitSection";
import RadioGroup from "./formFields/RadioGroup/RadioGroup";

const BiopsyForm = ({
  initialValues,
  handleSubmit,
  encounterId,
  isViewOnly,
}) => {
  const initialAreaHit =
    initialValues && initialValues.areaHit ? initialValues.areaHit : "";

  const [closedPositionalModal, setClosedPositionalModal] = useState(false);
  const [areaHitResult, setAreaHitResult] = useState(initialAreaHit);
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
            values.areaHit = areaHitResult;
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
                    autofill={!initialValues}
                    isDisabled={isViewOnly}
                  />
                  <TimeInput
                    name="timeTaken"
                    labelText="Time"
                    isShort
                    autofill={!initialValues}
                    timeWithSeconds
                    isRequired
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <br />
                <GpsFormSection
                  isRenderInfoLabel={closedPositionalModal}
                  initialValues={initialValues}
                  isViewOnly={isViewOnly}
                />
                <ListHeader title="Biopsy details" />
                <FormSection>
                  <Select
                    name="species"
                    labelText="Species"
                    options={species}
                    isRequired
                    isDisabled={isViewOnly}
                  />

                  <TextInput
                    name="attempt"
                    labelText="Attempt Number"
                    maxLength={255}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <TextInput
                    name="samplerName"
                    labelText="Sampler Name"
                    maxLength={255}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <TextInput
                    name="totalSpecimens"
                    labelText="Total Specimens"
                    maxLength={255}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="dartHit"
                    labelText="Dart hit?"
                    data-testid="dartHitId"
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="dartStuck"
                    labelText="Dart stuck?"
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="dartRetrieved"
                    labelText="Dart retrieved?"
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                  <RadioGroup
                    name="sampleType"
                    labelText="Sample type?"
                    options={[
                      { label: "Skin", value: "Skin" },
                      { label: "Skin & blubber", value: "Skin & blubber" },
                    ]}
                    isDisabled={isViewOnly}
                  />
                </FormSection>
                <ListHeader title="Select dart hit area" />
                <DartHitSection
                  areaHitResult={areaHitResult}
                  setAreaHitResult={setAreaHitResult}
                  isViewOnly={isViewOnly}
                />
              </section>
              {!isViewOnly && (
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
              )}
              <InputFocusOnError
                hasTriedToSubmit={checkingValidation}
                pageHasPositionalValues={true}
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
