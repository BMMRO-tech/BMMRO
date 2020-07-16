/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import { useState, useEffect, Fragment, useContext } from "react";
import { parse, format } from "date-fns";

import { DATE_FORMAT, TIME_FORMAT } from "../constants/forms";

import { fields } from "../forms/habitatUse/fields";
import { usePosition } from "../hooks/usePosition";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Button from "./Button";
import Select from "./Select";
import RecordSummaryList from "./RecordSummaryList";
import Input from "./Input";
import DatePicker from "./DatePicker";

const renderField = (config) => {
  switch (config.type) {
    case "select":
      return <Select config={config} />;
    case "date":
      return <DatePicker config={config} />;
    default:
      return <Input config={config} />;
  }
};

const HabitatUseForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [pendingRecords, setPendingRecords] = useState([]);
  const position = usePosition();
  const { datastore } = useContext(FirebaseContext);

  useEffect(() => {
    if (!!datastore) {
      try {
        datastore.subscribeToPendingHabitatUseRecords(setPendingRecords);
      } catch (e) {
        console.log(e);
      }
    }
  }, [datastore]);

  const styles = {
    inputFieldContainerSingle: css`
      margin-bottom: 5px;
    `,
    inputFieldContainerDouble: css`
      margin-bottom: 5px;

      @media (min-width: 500px) {
        grid-column: 1 / span 2;
      }
    `,
    formContainer: css`
      margin-bottom: 10px;

      @media (min-width: 500px) {
        display: grid;
        grid-template-columns: 45% 45%;
        grid-column-gap: 10%;
      }
    `,
    recordSummaryList: css`
      margin-top: 45px;
    `,
  };
  const generateSubmitMessage = () => {
    if (isSubmitted) {
      return !pendingRecords.length
        ? "Reading uploaded!"
        : "Reading stored locally";
    } else if (hasSubmitError) {
      return "Failed to upload!";
    }
  };

  return (
    <Fragment>
      <h1>Habitat Use Form</h1>
      <p>
        <small>
          <em>*required fields</em>
        </small>
      </p>
      <Formik
        enableReinitialize={true}
        initialValues={(() => {
          const initValues = {};

          fields.forEach((field) => {
            initValues[field.name] = field.initialValue
              ? field.initialValue()
              : "";
          });

          initValues["latitude"] = "0";
          initValues["longitude"] = "0";

          return initValues;
        })()}
        onSubmit={async (values, { setSubmitting }) => {
          const submitValues = { ...values };
          submitValues["date"] = format(submitValues["date"], DATE_FORMAT);

          submitValues["timestamp"] = parse(
            `${submitValues["date"]} ${submitValues["startTime"]}`,
            `${DATE_FORMAT} ${TIME_FORMAT}`,
            new Date()
          );
          try {
            datastore.createHabitatUse(submitValues);
            setIsSubmitted(true);
            setSubmitting(false);
          } catch (e) {
            setHasSubmitError(true);
            setSubmitting(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          isSubmitting,
          touched,
          values,
          errors,
        }) => (
          <Form>
            <div css={styles.formContainer}>
              {fields.map(
                ({
                  name,
                  label,
                  placeholder,
                  type,
                  options,
                  dependingOn,
                  validate,
                }) => {
                  const dependingFields = {};
                  dependingOn &&
                    dependingOn.forEach(
                      (field) => (dependingFields[field] = values[field])
                    );

                  const isPosition =
                    name === "latitude" || name === "longitude";
                  if (isPosition && values[name] === "0" && !!position[name]) {
                    values[name] = position[name];
                  }

                  const config = {
                    type,
                    name,
                    label,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    options,
                    placeholder,
                    touched: touched[name],
                    value: values[name],
                    error: errors[name],
                    dependingFields,
                    validate,
                  };

                  return (
                    <div
                      key={`habitat-use-form-field-${name}`}
                      css={
                        type === "textarea"
                          ? styles.inputFieldContainerDouble
                          : styles.inputFieldContainerSingle
                      }
                    >
                      {renderField(config)}
                    </div>
                  );
                }
              )}
            </div>
            <Button
              testId="submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
            {generateSubmitMessage()}
          </Form>
        )}
      </Formik>
      {!!pendingRecords.length && (
        <div css={styles.recordSummaryList}>
          <RecordSummaryList
            title="List of pending records"
            records={pendingRecords}
          />
        </div>
      )}
    </Fragment>
  );
};

export default HabitatUseForm;
