/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import React, { useState, useEffect } from "react";

import Input from "./Input";
import Button from "./Button";
import { datastore } from "../datastore/datastore";

const fields = [
  { name: "date", label: "Date", placeholder: "mm/dd/yyyy", type: "date" },
  { name: "encSeqNo", label: "Enc Seq #", placeholder: "1", type: "number" },
  { name: "species", label: "Species", placeholder: "whale", type: "text" },
  { name: "time", label: "Time", placeholder: "12:00", type: "time" },
];

const isoDateToday = () => {
  return new Date().toISOString().split("T")[0];
};

const HabitatUseForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState(null);

  useEffect(() => {
    datastore.listenForPendingHabitatUseWrites(setPendingUpdates);
  }, []);

  const styles = {
    inputFieldContainer: css`
      margin-bottom: 15px;
    `,
    formContainer: css`
      margin-bottom: 15px;
    `,
  };
  return (
    <React.Fragment>
      <h1>Habitat Use Form</h1>
      <Formik
        initialValues={{
          [fields[0].name]: isoDateToday(),
          [fields[1].name]: "",
          [fields[2].name]: "",
          [fields[3].name]: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }}
        validate={(values) => {
          const errors = {};
          const errorMessage = "Required";
          if (!values.date) {
            errors.date = errorMessage;
          }
          if (!values.encSeqNo) {
            errors.encSeqNo = errorMessage;
          }
          if (!values.species) {
            errors.species = errorMessage;
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          datastore.createHabitatUse(values);
          setSuccessMessage("Reading added");
          setSubmitting(false);
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
          <div css={styles.formContainer}>
            <Form>
              {fields.map(({ name, label, placeholder, type }) => (
                <div
                  key={`habitat-use-form-field-${name}`}
                  css={styles.inputFieldContainer}
                >
                  <Input
                    type={type}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched[name]}
                    value={values[name]}
                    error={errors[name]}
                  />
                </div>
              ))}
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          </div>
        )}
      </Formik>
      {!!successMessage && <div>{successMessage}</div>}
      {!!pendingUpdates && (
        <div>Number of pending updates: {pendingUpdates.length}</div>
      )}
    </React.Fragment>
  );
};

export default HabitatUseForm;
