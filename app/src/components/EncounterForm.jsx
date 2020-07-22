/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import TextInput from "./formFields/TextInput/TextInput";

const styles = {
  formContainer: css`
    margin-bottom: 10px;

    @media (min-width: 500px) {
      display: grid;
      grid-template-columns: 45% 45%;
      grid-column-gap: 10%;
    }
  `,
};

const EncounterForm = () => {
  return (
    <Formik initialValues={{}}>
      <Form>
        <div css={styles.formContainer}>
          <TextInput
            name="species"
            labelText="Your species please"
            isRequired={true}
          />
        </div>
      </Form>
    </Formik>
  );
};

export default EncounterForm;
