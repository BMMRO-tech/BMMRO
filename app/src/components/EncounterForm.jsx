/** @jsx jsx */
import { Fragment, useContext } from "react";
import { Formik, Form } from "formik";
import { navigate } from "@reach/router";
import { css, jsx } from "@emotion/core";

import breakPoints from "../materials/breakPoints";
import typography from "../materials/typography";
import colors from "../materials/colors";
import TextInput from "./formFields/TextInput/TextInput";
import NumberInput from "./formFields/NumberInput/NumberInput";
import DateInput from "./formFields/DateInput/DateInput";
import Select from "./formFields/Select/Select";
import Button from "./Button";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import clientPersistence from "../clientPersistence/clientPersistence";
import { ROUTES } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";

import areaOptions from "../constants/areaOptions";
import speciesOptions from "../constants/speciesOptions";
import projectOptions from "../constants/projectOptions";
import cueOptions from "../constants/cueOptions";
import vesselOptions from "../constants/vesselOptions";

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

    @media (min-width: ${breakPoints.mediumTablet}) {
      margin-bottom: 0;
    }
  `,
  fieldsContainer: css`
    @media (min-width: ${breakPoints.mediumTablet}) {
      display: grid;
      grid-template-columns: 45% 45%;
      grid-column-gap: 10%;
    }
  `,
  legend: css`
    margin-top: 0;
    font-size: smaller;
  `,
  requiredLegend: css`
    color: ${colors.darkRed};
    margin-right: 5px;
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
              <DateInput
                name="startTimestamp"
                labelText="Date"
                isRequired
                isShort
              />
              <TextInput
                name="sequenceNumber"
                labelText="Encounter sequence"
                maxLength={100}
                isRequired
                isShort
              />
              <Select
                name="area"
                labelText="Area"
                options={areaOptions}
                isRequired
              />
              <Select
                name="species"
                labelText="Species"
                options={speciesOptions}
                isRequired
              />
              <Select
                name="project"
                labelText="Project"
                options={projectOptions}
              />
              <Select name="cue" labelText="Cue" options={cueOptions} />
              <Select
                name="vessel"
                labelText="Vessel"
                options={vesselOptions}
              />
              <TextInput
                name="observers"
                labelText="Observers"
                maxLength={200}
              />
              <NumberInput
                name="groupSize"
                labelText="Group size (visual)"
                minValue={1}
                maxValue={9999}
                isShort
                isInteger
              />
              <TextInput name="location" labelText="Location" maxLength={100} />
            </div>
            <p css={styles.legend}>
              <span css={styles.requiredLegend}>*</span>required fields
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
