/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { Formik, Form } from "formik";
import { useState } from "react";

import utilities from "../materials/utilities";
import Button from "./Button";
import FormSection from "./FormSection";
import ListHeader from "./list/ListHeader";
import biopsyFormDefaults from "../constants/biopsyFormDefaultValues";

import Select from "./formFields/Select/Select";

import species from "../constants/formOptions/species";
import { generateOpenEncounterURL } from "../constants/routes";

const BiopsyForm = ({
  initialValues,
  handleSubmit,
  isViewOnly,
  encounterId,
  isPageNewBiopsyForm,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPositionalModal, setShowPositionalModal] = useState({
    boolean: false,
    values: "",
  });
  const [closedPositionalModal, setClosedPositionalModal] = useState(false);
  const [refreshLatLong, setRefreshLatLong] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ latitude: "", longitude: "" });
  const [error, setError] = useState(null);

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
          async
          onSubmit={(values) => {
            values.hasEnded ||
            (values.longitude && values.latitude) ||
            values.gpsMark
              ? handleSubmit(values)
              : setShowPositionalModal({ boolean: true, values: values });
          }}
        >
          {({ values }) => (
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
                  {!!initialValues ? "Save" : "Save"}
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
