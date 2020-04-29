/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";

import Input from "./Input";
import Button from "./Button";
import { datastore } from "../datastore/datastore";

const fields = [
  { name: "date", label: "Date", placeholder: "mm/dd/yyyy" },
  { name: "encSeqNo", label: "Enc Seq #", placeholder: "1" },
  { name: "species", label: "Species", placeholder: "whale" },
];

const HabitatUseForm = () => {
  const styles = {
    inputContainer: css`
      margin-bottom: 15px;
    `,
  };
  return (
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
        await datastore.createHabitatUse(values);
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
        <Form>
          {fields.map(({ name, label, placeholder }) => (
            <div
              key={`habitat-use-form-field-${name}`}
              css={styles.inputContainer}
            >
              <Input
                type="text"
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
      )}
    </Formik>
  );
};

export default HabitatUseForm;
