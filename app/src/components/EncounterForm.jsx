/** @jsx jsx */
import { Fragment, useContext } from "react";
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
import { FirebaseContext } from "../firebaseContext/firebaseContext";

import areaOptions from "../constants/areaOptions";
import speciesOptions from "../constants/speciesOptions";
import { ROUTES } from "../constants/routes";

import clientPersistence from "../clientPersistence/clientPersistence";
import { CollectionNames } from "../constants/datastore";

const styles = {
  title: css`
    ${typography.title}
    background-color: ${colors.lighterGray};
    padding: 10px;
    margin-bottom: 15px;
  `,
  formContainer: css`
    padding: 0 20px;
    margin-bottom: 70px;

    @media (min-width: ${breakPoints.maxPhone}) {
      margin-bottom: 0;
    }
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
  buttonContainer: css`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    position: fixed;
    bottom: 0;
    background: white;
    width: 100%;
    padding: 10px;
    box-shadow: 0 -1px 5px 1px rgba(40, 54, 104, 0.15);
    left: 0;

    @media (min-width: ${breakPoints.maxPhone}) {
      position: relative;
      bottom: auto;
      background: none;
      box-shadow: none;
    }
  `,
  submitButton: `
    margin: 0 auto;
  `,
};

const EncounterForm = () => {
  const { datastore } = useContext(FirebaseContext);

  return (
    <Fragment>
      <h1 css={styles.title}>New Encounter</h1>
      <div css={styles.formContainer}>
        <Formik
          initialValues={{
            sequenceNumber: "",
            startTimestamp: new Date(),
            area: "",
            species: "",
          }}
          onSubmit={(values) => {
            const path = datastore.createDoc(CollectionNames.ENCOUNTER, values);
            clientPersistence.set("openEncounterPath", path);
            navigate(ROUTES.openEncounter);
          }}
        >
          <Form>
            <div css={styles.fieldsContainer}>
              <TextInput
                name="sequenceNumber"
                labelText="Sequence Number*"
                isRequired={true}
                maxLength={100}
              />
              <DateInput
                name="startTimestamp"
                labelText="Date*"
                isRequired={true}
              />
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
            <div css={styles.buttonContainer}>
              <Button styles={styles.submitButton} type="submit">
                Save Encounter
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </Fragment>
  );
};

export default EncounterForm;
