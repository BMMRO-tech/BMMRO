/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import animalReactions from "../constants/formOptions/animalReactions";
import FormSection from "./FormSection";
import Checkbox from "./formFields/Checkbox/Checkbox";

const styles = {
  doubleGrid: css`
    grid-column: span 2;
  `,
};

const AnimalReactionFormSection = ({ isViewOnly }) => {
  return (
    <FormSection css={styles.doubleGrid}>
      <div>
        <h4> Behaviour </h4>
        {animalReactions.map((reaction) => (
          <Checkbox
            key={reaction}
            name={reaction}
            labelText={reaction}
            isDisabled={isViewOnly}
          ></Checkbox>
        ))}
      </div>
    </FormSection>
  );
};

export default AnimalReactionFormSection;
