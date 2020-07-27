/** @jsx jsx */
import { Fragment } from "react";
import { Formik, Form } from "formik";
import { navigate } from "@reach/router";
import { css, jsx } from "@emotion/core";

import breakPoints from "../materials/breakPoints";
import typography from "../materials/typography";
import colors from "../materials/colors";
import TextInput from "./formFields/TextInput/TextInput";
import DateInput from "./formFields/DateInput/DateInput";
import Select from "./formFields/Select/Select";
import Button from "./Button";

import areaOptions from "../constants/areaOptions";
import speciesOptions from "../constants/speciesOptions";
import { ROUTES } from "../constants/routes";

import clientPersistence from "../clientPersistence/clientPersistence";

const styles = {
  title: css`
    ${typography.title}
    background-color: ${colors.lighterGray};
    padding: 10px;
    margin-bottom: 15px;
  `,
  formContainer: css`
    padding: 0 20px;
  `,
  fieldsContainer: css`
    @media (min-width: ${breakPoints.maxPhone}) {
      display: grid;
      grid-template-columns: 45% 45%;
      grid-column-gap: 10%;
    }
  `,
  legend: css`
    margin-top: 0;
  `,
  submitButton: `
      margin: 0 auto;
    `,
};

const EncounterForm = () => {
  return (
    <Fragment>
      <h1 css={styles.title}>New Encounter</h1>
      <div css={styles.formContainer}>
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
            <div css={styles.fieldsContainer}>
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
            <p css={styles.legend}>
              <small>
                <em>*required fields</em>
              </small>
            </p>
            <Button styles={styles.submitButton} type="submit">
              Submit
            </Button>
          </Form>
        </Formik>
      </div>
    </Fragment>
  );
};

export default EncounterForm;
