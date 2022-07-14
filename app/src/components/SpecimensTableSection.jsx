/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import FormSection from "./FormSection";
import TextInput from "./formFields/TextInput/TextInput";
import Select from "./formFields/Select/Select";
import tissueTypes from "../constants/formOptions/tissueTypes";
import tissueStorages from "../constants/formOptions/tissueStorages";
import colors from "../materials/colors";
import { FieldArray } from "formik";
import { useState } from "react";

import Button from "./Button";

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

const SpecimensTableSection = ({ specimen }) => {
  const [isTableHidden, setIsTableHidden] = useState(false);
  return (
    <FieldArray name="specimens">
      {({ unshift }) => (
        <div>
          <FormSection isOneLine4Elements>
            <Button
              styles={styles.primary}
              type="button"
              onClick={() => {
                unshift({
                  specimenNumber: "",
                  sampleType: "",
                  storageType: "",
                });
                setIsTableHidden(false);
              }}
            >
              Add Specimen +
            </Button>
            <div></div>
            <Button
              styles={styles.primary}
              type="button"
              onClick={() => setIsTableHidden((current) => !current)}
            >
              {isTableHidden ? "Show ↓" : "Hide ↑"}
            </Button>
          </FormSection>
          <div hidden={isTableHidden}>
            <FormSection>
              <h3>Total Specimens Recorded : {specimen.length}</h3>
            </FormSection>
            <FormSection isOneLine4Elements>
              <label>Specimen #</label>
              <label>Sample Type</label>
              <label>Tissue storage</label>
            </FormSection>
          </div>
          {specimen.length > 0 &&
            specimen.map((specimen, index) => (
              <div className="row" key={index} hidden={isTableHidden}>
                <FormSection isOneLine4Elements>
                  <TextInput
                    name={`specimens.${index}.specimenNumber`}
                    maxLength={20}
                    isShort
                  />
                  <Select
                    name={`specimens.${index}.sampleType`}
                    options={tissueTypes}
                    isShort
                  />
                  <Select
                    name={`specimens.${index}.storageType`}
                    options={tissueStorages}
                  />
                </FormSection>
              </div>
            ))}
        </div>
      )}
    </FieldArray>
  );
};

export default SpecimensTableSection;
