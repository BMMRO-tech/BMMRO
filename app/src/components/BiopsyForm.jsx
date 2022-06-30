/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { Formik, Form } from "formik";
import { useState } from "react";

import utilities from "../materials/utilities";
import Button from "./Button";
import FormSection from "./FormSection";
import ListHeader from "./list/ListHeader";

import Select from "./formFields/Select/Select";

import species from "../constants/formOptions/species";
import { generateOpenEncounterURL } from "../constants/routes";

const styles = {
  cancelButton: css`
    margin-right: 10px;
  `,
  section: css`
    background-color: none;
  `,
};

const BiopsyForm = ({ encounterId, handleSubmit, isViewOnly }) => {
  const [submitType, setSubmitType] = useState(null);
  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          onSubmit={(values) => {
            handleSubmit(submitType, values);
          }}
        >
          {({ values, submitForm }) => (
            <Form>
              <section css={styles.section}>
                <ListHeader title="Encounter details" />
                <FormSection>
                  <Select
                    name="species"
                    labelText="Species"
                    options={species}
                    isRequired
                    isDisabled={isViewOnly}
                  />
                </FormSection>
              </section>
              <div css={utilities.sticky.footerContainer}>
                <Link to={generateOpenEncounterURL(encounterId)}>
                  <Button
                    styles={styles.cancelButton}
                    variant="secondary"
                    testId={"cancelBiopsy"}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" testId={"saveBiopsy"}>
                    Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BiopsyForm;
