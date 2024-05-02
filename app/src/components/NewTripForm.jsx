/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Form, Formik } from "formik";
import { useState, Fragment, useEffect, useRef } from "react";
import { navigate } from "@reach/router";
import { format } from "date-fns";

import utilities from "../materials/utilities";
import { getModifiedProperties } from "../utils/math";
import CancelFormConfirmationModal from "../components/CancelFormConfirmationModal";
import ListHeader from "./list/ListHeader";
import Button from "./Button";
import FormSection from "./FormSection";

import DateInput from "./formFields/DateInput/DateInput";
import InputFocusOnError from "./formFields/InputFocusOnError";
import Select from "./formFields/Select/Select";
import TextInput from "./formFields/TextInput/TextInput";
import TimeInput from "./formFields/TimeInput/TimeInput";

import area from "../constants/formOptions/area";
import tripDefaults from "../constants/tripDefaultValues";
import { ROUTES } from "../constants/routes";
import vessel from "../constants/formOptions/vessel";
import direction from "../constants/formOptions/direction";
import { getProjects } from "../hooks/getProjects";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";

const NewTripForm = ({ handleSubmit, datastore, isViewOnly }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const ref = useRef(null);

  const [projectsList, setProjectsList] = useState();

  useEffect(() => {
    getProjects(datastore).then((data) => setProjectsList(data));
  });

  useEffect(() => {
    handleSetFieldValue(
      "gpsFileName",
      generateGpsFileName(ref.current?.values)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current?.values.date, ref.current?.values.vessel]);

  useEffect(() => {
    handleSetFieldValue(
      "numberOfObservers",
      calculateObservers(ref.current?.values.observers)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current?.values.observers]);

  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
    endButton: css`
      margin-right: 10px;
    `,
  };

  const handleSetFieldValue = (field, value) => {
    const setFieldValue = ref.current?.setFieldValue;
    if (setFieldValue) setFieldValue(field, value);
  };

  const transformSubmitValues = (values) => {
    values.date.setHours(0, 0, 0, 0);
  };

  const calculateObservers = (observers) => {
    return observers?.split(",").filter((value) => value.trim()).length;
  };

  const generateGpsFileName = (values) => {
    const date = values.date ? format(values.date, "yy_MMdd") : "";
    const vessel = values.vessel ? values?.vessel.slice(0, 2) : "";

    const filename =
      date && vessel ? `${date}-${vessel}` : date || vessel || "";

    return filename + ".txt";
  };

  const renderConfirmationModal = () => {
    return (
      <CancelFormConfirmationModal
        closeModal={() => setShowConfirmationModal(false)}
        handleLeavePage={() => navigate(ROUTES.trips)}
      />
    );
  };

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={tripDefaults}
          innerRef={ref}
          onSubmit={(values) => {
            values.tripId =
              format(values.date, "yy_MMdd") +
              values?.vessel.slice(0, 2) +
              values.tripNumber;
            transformSubmitValues(values);
            handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              <section>
                <ListHeader title="Trip details" />
                <FormSection>
                  <TextInput
                    name="tripNumber"
                    labelText="Trip number"
                    isRequired
                    type={"number"}
                  />

                  <DateInput
                    name="date"
                    labelText="Date"
                    isRequired
                    notAfter={new Date()}
                    autofill={true}
                  />

                  <TimeInput
                    name="time"
                    labelText="Time"
                    autofill={true}
                    notAfter={values.date}
                    isRequired
                  />
                </FormSection>
              </section>
              <br />

              <section>
                <FormSection>
                  <Select
                    name="area"
                    labelText="Area"
                    options={area}
                    isRequired
                  />

                  <Select
                    name="vessel"
                    labelText="Vessel"
                    options={vessel}
                    isDisabled={isViewOnly}
                    isRequired
                  />

                  <TextInput name="gpsFileName" labelText="GPS file name" />

                  <TextInput name="observers" labelText="Observers" />

                  <TextInput
                    name="numberOfObservers"
                    labelText="Number of Observers"
                    type={"number"}
                  />

                  <Select
                    name="project"
                    labelText="Project"
                    options={projectsList || []}
                    isDisabled={isViewOnly}
                  />

                  <TextInput
                    name="engineHoursMeterReading"
                    labelText="Engine hours meter reading"
                    type={"number"}
                  />

                  <TextInput
                    name="windSpeed"
                    labelText="Wind speed (knots)"
                    type={"number"}
                  />

                  <Select
                    name="windDirection"
                    labelText="Wind Direction"
                    options={direction}
                    isDisabled={isViewOnly}
                  />

                  <TextAreaInput
                    name="comments"
                    labelText="Comments"
                    maxLength={1000}
                    isDouble
                    isDisabled={isViewOnly}
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
                    testId={"newLogBook"}
                  >
                    Save & Start Logbook
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

export default NewTripForm;
