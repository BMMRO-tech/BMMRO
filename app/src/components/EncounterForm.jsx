/** @jsx jsx */
import { Formik, Form } from "formik";
import { navigate } from "@reach/router";
import { css, jsx } from "@emotion/core";

import TextInput from "./formFields/TextInput/TextInput";
import DateInput from "./formFields/DateInput/DateInput";
import Select from "./formFields/Select/Select";
import Button from "./Button";

import areaOptions from "../constants/areaOptions";
import speciesOptions from "../constants/speciesOptions";
import { ROUTES } from "../constants/routes";

import clientPersistence from "../clientPersistence/clientPersistence";

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

      <Formik
        initialValues={{
          sequenceNumber: "",
          date: new Date(),
          area: "",
          species: "",
        }}
        onSubmit={(values) => {
          console.log(values);
          clientPersistence.set("openEncounterId", "abc");
          navigate(ROUTES.openEncounter);
        }}
      >
        <Form>
          <div css={styles.formContainer}>
            <TextInput
              name="sequenceNumber"
              labelText="Sequence Number*"
              isRequired={true}
            />
            <DateInput name="date" labelText="Date*" isRequired={true} />
            <Select
              name="area"
              labelText="Area*"
              options={areaOptions}
              isRequired={true}
            />
            <Select
              name="species"
              labelText="Species*"
              options={speciesOptions}
              isRequired={true}
            />
          </div>
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </div>
  );
};

export default EncounterForm;
