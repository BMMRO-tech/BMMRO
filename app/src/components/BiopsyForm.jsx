/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { Formik, Form } from "formik";

import utilities from "../materials/utilities";
import Button from "./Button";
import FormSection from "./FormSection";
import ListHeader from "./list/ListHeader";
import biopsyFormDefaults from "../constants/biopsyFormDefaultValues";

import DateInput from "./formFields/DateInput/DateInput";
import TimeInput from "./formFields/TimeInput/TimeInput";

import Select from "./formFields/Select/Select";
import species from "../constants/formOptions/species";
import { generateOpenEncounterURL } from "../constants/routes";

const BiopsyForm = (
  { 
    initialValues,
    handleSubmit,
    encounterId 
  }) => {
  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
    section: css`
      background-color: none;
    `,
  };

  const initValues = initialValues || biopsyFormDefaults;

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={initValues}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              <section css={styles.section}>
                <ListHeader title="Biopsy Details" />
                <FormSection>
                  <Select
                    name="species"
                    labelText="Species"
                    options={species}
                    isRequired
                    isDisabled={false}
                  />
                </FormSection>
                <FormSection>
                 <DateInput
                   name="Date"
                   labelText="Date"
                   isRequired
                   isShort
                   notAfter={new Date()}
                   autofill={true}
                 />
                 <TimeInput
                   name="Time"
                   labelText="Time"
                   isShort
                   autofill={true}
                   timeWithSeconds
                   notAfter={values.startTimestamp}
                   isRequired
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
                <Button type="submit" testId={"saveBiopsy"} >
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
