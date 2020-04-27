/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";

import Input from "./Input";
import Button from "./Button";

const fields = [
  { name: "date", label: "Date" },
  { name: "encSeqNo", label: "Enc Seq #" },
  { name: "species", label: "Species" },
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
      onSubmit={(values) => console.log(values)}
    >
      {({ handleChange, handleBlur, touched, values, errors }) => (
        <Form>
          {fields.map(({ name, label }) => (
            <div
              key={`habitat-use-form-field-${name}`}
              css={styles.inputContainer}
            >
              <Input
                type="text"
                name={name}
                label={label}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched[name]}
                value={values[name]}
                error={errors[name]}
              />
            </div>
          ))}
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default HabitatUseForm;
