/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import { useState, useEffect, Fragment, useContext } from "react";

import { fields } from "../forms/habitatUseFields";
import { usePosition } from "../position/usePosition";
import { DatastoreContext } from "../App";
import Button from "./Button";
import Select from "./Select";
import RecordSummaryList from "./RecordSummaryList";
import Input from "./Input";

const HabitatUseForm = () => {
  const [submitMessage, setSubmitMessage] = useState(null);
  const [pendingRecords, setPendingRecords] = useState([]);
  const { latitude, longitude } = usePosition();
  const { datastore } = useContext(DatastoreContext);

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
  return (
    <Fragment>
      <h1>Habitat Use Form</h1>
      <Formik
        enableReinitialize={true}
        initialValues={(function () {
          const initValues = {};

          fields.forEach((field) => {
            initValues[field.name] = field.initialValue
              ? field.initialValue()
              : "";
          });
          initValues["latitude"] = latitude || "";
          initValues["longitude"] = longitude || "";

          return initValues;
        })()}
        onSubmit={async (values, { setSubmitting }) => {
          const online = window.navigator.onLine;

          if (online) {
            try {
              await datastore.createHabitatUse(values);
              setSubmitMessage("Reading uploaded");
              setSubmitting(false);
            } catch (e) {
              setSubmitMessage("Failed to upload!");
              setSubmitting(false);
            }
          } else {
            datastore.createHabitatUse(values);
            setSubmitMessage("Reading stored locally");
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
                  required,
                  placeholder,
                  type,
                  options,
                  validate,
                  dependingOn,
                }) => {
                  const dependingFields = {};
                  dependingOn &&
                    dependingOn.forEach(
                      (field) => (dependingFields[field] = values[field])
                    );
                  const config = {
                    type,
                    name,
                    label,
                    required,
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
                      {type === "select" ? (
                        <Select config={config} />
                      ) : (
                        <Input config={config} />
                      )}
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
          </Form>
        )}
      </Formik>
      {!!submitMessage && <div>{submitMessage}</div>}
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
