/** @jsx jsx */
import { Formik, Form } from "formik";
import { css, jsx } from "@emotion/core";
import { useContext, Fragment } from "react";
import { navigate } from "@reach/router";

import { ROUTES } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
import { fields } from "../forms/habitatUse/fields";
import { usePosition } from "../hooks/usePosition";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import breakPoints from "../materials/breakPoints";
import typography from "../materials/typography";
import colors from "../materials/colors";
import Button from "./Button";
import Select from "./Select";
import Input from "./Input";

const HabitatUseForm = ({ encounterPath, encounterStartTimestamp }) => {
  const position = usePosition();
  const { datastore } = useContext(FirebaseContext);

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
    inputFieldContainerSingle: css`
      margin-bottom: 5px;
    `,
    inputFieldContainerDouble: css`
      margin-bottom: 5px;

      @media (min-width: ${breakPoints.maxPhone}) {
        grid-column: 1 / span 2;
      }
    `,
    legend: css`
      margin-top: 0;
    `,
    submitButton: `
      margin: 0 auto;
    `,
  };

  return (
    <Fragment>
      <h1 css={styles.title}>Habitat Use Form</h1>
      <div css={styles.formContainer}>
        <Formik
          enableReinitialize={true}
          initialValues={(() => {
            const initValues = {};

            fields.forEach((field) => {
              initValues[field.name] = field.initialValue
                ? field.initialValue()
                : "";
            });

            initValues["latitude"] = "0";
            initValues["longitude"] = "0";
            initValues["date"] = encounterStartTimestamp;

            return initValues;
          })()}
          onSubmit={(values) => {
            delete values["date"];

            datastore.createSubDoc(
              encounterPath,
              CollectionNames.HABITAT_USE,
              values
            );
            navigate(ROUTES.openEncounter);
          }}
        >
          {({
            handleChange,
            handleBlur,
            isSubmitting,
            touched,
            values,
            errors,
          }) => (
            <Form>
              <div css={styles.fieldsContainer}>
                {fields.map(
                  ({
                    name,
                    label,
                    placeholder,
                    type,
                    options,
                    dependingOn,
                    validate,
                  }) => {
                    const dependingFields = {};
                    dependingOn &&
                      dependingOn.forEach(
                        (field) => (dependingFields[field] = values[field])
                      );

                    const isPosition =
                      name === "latitude" || name === "longitude";
                    if (
                      isPosition &&
                      values[name] === "0" &&
                      !!position[name]
                    ) {
                      values[name] = position[name];
                    }

                    const config = {
                      type,
                      name,
                      label,
                      onChange: handleChange,
                      onBlur: handleBlur,
                      options,
                      placeholder,
                      touched: touched[name],
                      value: values[name],
                      error: errors[name],
                      dependingFields,
                      validate,
                    };

                    return (
                      <div
                        key={`habitat-use-form-field-${config.name}`}
                        css={
                          config.type === "textarea"
                            ? styles.inputFieldContainerDouble
                            : styles.inputFieldContainerSingle
                        }
                      >
                        {config.type === "select" ? (
                          <Select config={config} />
                        ) : (
                          <Input config={config} />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
              <p css={styles.legend}>
                <small>
                  <em>*required fields</em>
                </small>
              </p>
              <Button
                styles={styles.submitButton}
                testId="submit-button"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
};

export default HabitatUseForm;
