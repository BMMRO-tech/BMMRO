/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import { useState, useEffect, Fragment, useContext } from "react";

import { fields } from "../forms/habitatUse/fields";
import { usePosition } from "../hooks/usePosition";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Button from "./Button";
import Select from "./Select";
import RecordSummaryList from "./RecordSummaryList";
import Input from "./Input";

const HabitatUseForm = () => {
  const [submitMessage, setSubmitMessage] = useState(null);
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

          initValues["latitude"] = "0";
          initValues["longitude"] = "0";

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
            {!!submitMessage && submitMessage}
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
