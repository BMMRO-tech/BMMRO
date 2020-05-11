/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import { useState, useEffect, Fragment } from "react";

import Input from "./Input";
import Button from "./Button";
import RecordSummaryList from "./RecordSummaryList";
import { datastore } from "../datastore/datastore";
import { usePosition } from "../position/usePosition";

const fields = [
  { name: "date", label: "Date", placeholder: "mm/dd/yyyy", type: "date" },
  { name: "encSeqNo", label: "Enc Seq #", placeholder: "1", type: "number" },
  { name: "species", label: "Species", placeholder: "whale", type: "text" },
  { name: "time", label: "Time", placeholder: "12:00", type: "time" },
  { name: "latitude", label: "Lat", placeholder: "lat", type: "text" },
  { name: "longitude", label: "Long", placeholder: "long", type: "text" },
];

const isoDateToday = () => {
  return new Date().toISOString().split("T")[0];
};

const HabitatUseForm = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [pendingRecords, setPendingRecords] = useState([]);
  const { latitude, longitude } = usePosition();

  useEffect(() => {
    datastore.listenForPendingHabitatUseRecords(setPendingRecords);
  }, []);

  const styles = {
    inputFieldContainer: css`
      margin-bottom: 15px;
    `,
    formContainer: css`
      margin-bottom: 15px;
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
        initialValues={{
          [fields[0].name]: isoDateToday(),
          [fields[1].name]: "",
          [fields[2].name]: "",
          [fields[3].name]: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          [fields[4].name]: latitude || "",
          [fields[5].name]: longitude || "",
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
          if (!values.latitude) {
            errors.latitude = errorMessage;
          }
          if (!values.longitude) {
            errors.longitude = errorMessage;
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
