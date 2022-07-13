/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import FormSection from "./FormSection";
import TextInput from "./formFields/TextInput/TextInput";
import Select from "./formFields/Select/Select";
import tissueTypes from "../constants/formOptions/tissueTypes";
import tissueStorages from "../constants/formOptions/tissueStorages";
import colors from "../materials/colors";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { useState } from "react";

import Button from "./Button";

import ListHeader from "./list/ListHeader";

const styles = {
  container: css`
    grid-column: span 2;
  `,
  primary: css`
      background: ${colors.mediumTurquoise};
      color: ${colors.white};
      border: 1px solid ${colors.mediumTurquoise};
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
  const [isTableHidden, setIsTableHidden] = useState(false); 
  return (
    <FormSection>
      <div css={styles.container}>
        <Formik initialValues={initialValues}>
          {({ values }) => (
            <Form>
              <FieldArray name="specimens">
                {({ insert, remove, push, unshift }) => (
                  <div >
                    <FormSection isOneLine4Elements>
                    <Button
                      styles={styles.primary}
                      onClick={() =>
                        unshift({
                          specimenNumber: "",
                          sampleType: "",
                          storageType: "",
                        })
                      }
                    >
                      Add Specimen
                    </Button>
                    <div></div>
                    <Button
                      styles={styles.primary}
                      onClick={() =>
                        setIsTableHidden(current => !current)
                      }
                    >
                      {isTableHidden ? "Show" : "Hide"}
                    </Button>
                    </FormSection>
                    <FormSection>
                      <h3>Total Specimens Recorded : {values.specimens.length}</h3>
                    </FormSection>
                    <FormSection isOneLine4Elements>
                      <label>Specimen #</label>
                      <label>Sample Type</label>
                      <label>Tissue storage</label>
                    </FormSection>
                    {values.specimens.length > 0 &&
                      values.specimens.map((specimen, index) => (
                        <div className="row" key={index} hidden={isTableHidden}>
                        <FormSection isOneLine4Elements>
                          <TextInput
                            name= {`specimens.${index}.specimenNumber`}
                            labelText=""
                            maxLength={20}
                            isShort
                          />
                          <Select
                            name= {`specimens.${index}.sampleType`}
                            labelText=""
                            options={tissueTypes}
                            isShort
                          />
                          <Select
                            name={`specimens.${index}.storageType`}
                            labelText=""
                            options={tissueStorages}
                          />
                          {/* <Button
                            onClick={() => remove(index)}
                          >
                            X
                          </Button> */}
                        </FormSection>
                        </div>
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
