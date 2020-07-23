/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import TextInput from "./formFields/TextInput/TextInput";
import Select from "./formFields/Select/Select";

const styles = {
  container: css`
    padding: 0 15px;
  `,
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
    <div css={styles.container}>
      <h1>New Encounter</h1>
      <p>
        <small>
          <em>*required fields</em>
        </small>
      </p>

      <Formik initialValues={{ favoriteColor: "", species: "" }}>
        <Form>
          <div css={styles.formContainer}>
            <TextInput
              name="favoriteColor"
              labelText="Your favorite color please"
              isRequired={true}
            />
            <Select
              name="species"
              labelText="Your species please"
              options={["Homo sapiens", "Daucus carota", "Crangon crangon"]}
              isRequired={true}
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EncounterForm;
