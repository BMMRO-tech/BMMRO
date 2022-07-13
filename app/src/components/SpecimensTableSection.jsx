/** @jsx jsx */
import { jsx } from "@emotion/core";
import FormSection from "./FormSection";
import TextInput from "./formFields/TextInput/TextInput";
import Select from "./formFields/Select/Select";
import tissueTypes from "../constants/formOptions/tissueTypes";
import tissueStorages from "../constants/formOptions/tissueStorages";

const SpecimensTableSection = () => {
  return (
    <FormSection>
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
    </FormSection>
  );
};

export default SpecimensTableSection;
