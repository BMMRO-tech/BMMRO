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

const SpecimensTableSection = ({
  specimens,
  isViewOnly,
  getTotalSpecimens,
}) => {
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
              disabled={isViewOnly}
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
          <FormSection>
            <h3>Total Specimens Recorded : {getTotalSpecimens(specimens)}</h3>
          </FormSection>
          <div hidden={isTableHidden}>
            <FormSection isOneLine4Elements>
              <label>Specimen #</label>
              <label>Sample Type</label>
              <label>Tissue storage</label>
            </FormSection>
          </div>
          {specimens &&
            specimens.length > 0 &&
            specimens.map((specimens, index) => (
              <div className="row" key={index} hidden={isTableHidden}>
                <FormSection isOneLine4Elements>
                  <TextInput
                    name={`specimens.${index}.specimenNumber`}
                    maxLength={20}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name={`specimens.${index}.sampleType`}
                    options={tissueTypes}
                    isShort
                    isDisabled={isViewOnly}
                  />
                  <Select
                    name={`specimens.${index}.storageType`}
                    options={tissueStorages}
                    isDisabled={isViewOnly}
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
