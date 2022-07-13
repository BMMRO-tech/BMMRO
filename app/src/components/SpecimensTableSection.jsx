/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import FormSection from "./FormSection";
import TextInput from "./formFields/TextInput/TextInput";
import Select from "./formFields/Select/Select";
import tissueTypes from "../constants/formOptions/tissueTypes";
import tissueStorages from "../constants/formOptions/tissueStorages";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";

import ListHeader from "./list/ListHeader";

const styles = {
  container: css`
    grid-column: span 2;
  `,
};

const initialValues = {
  specimens: [
    {
      specimenNumber: "",
      sampleType: "",
      storageType: "",
    },
  ],
};

const SpecimensTableSection = (specimensValues) => {
  return (
    <FormSection>
      <div css={styles.container}>
        <Formik initialValues={initialValues}>
          {({ values }) => (
            <Form>
              <FieldArray name="specimens">
                {({ insert, remove, push, unshift }) => (
                  <div>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        unshift({
                          specimenNumber: "",
                          sampleType: "",
                          storageType: "",
                        })
                      }
                    >
                      Add Specimen
                    </button>
                    {values.specimens.length > 0 &&
                      values.specimens.map((specimen, index) => (
                        <FormSection isOneLine4Elements key={index}>
                          <TextInput
                            name="specimenNumber"
                            labelText="Specimen #"
                            maxLength={20}
                            isShort
                          />
                          <Select
                            name="tissueType"
                            labelText="Tissue type"
                            options={tissueTypes}
                            isShort
                          />
                          <Select
                            name="tissueStorage"
                            labelText="Tissue storage"
                            options={tissueStorages}
                            isShort
                          />
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => remove(index)}
                          >
                            X
                          </button>
                        </FormSection>
                      ))}
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    </FormSection>
  );
};

export default SpecimensTableSection;
