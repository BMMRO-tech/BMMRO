/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import React, { useState } from "react";

import Input from "./Input";
import Button from "./Button";
import { datastore } from "../datastore/datastore";
import ErrorMessage from "./ErrorMessage";

const fields = [
  { name: "date", label: "Date", placeholder: "mm/dd/yyyy", type: "date" },
  { name: "encSeqNo", label: "Enc Seq #", placeholder: "1", type: "number" },
  { name: "species", label: "Species", placeholder: "whale", type: "text" },
];

const HabitatUseForm = () => {
  const [generalError, setGeneralError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
          [fields[0].name]: "",
          [fields[1].name]: "",
          [fields[2].name]: "",
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
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          try {
            await datastore.createHabitatUse(values);
            setSuccessMessage("Form submitted successfully");
          } catch (e) {
            setGeneralError("Error submitting the form");
          }
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
      {!!generalError && <ErrorMessage text={generalError} />}
      {!!successMessage && <div>{successMessage}</div>}
    </React.Fragment>
  );
};

export default HabitatUseForm;
