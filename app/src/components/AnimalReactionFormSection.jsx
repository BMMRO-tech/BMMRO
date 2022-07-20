/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import animalReactions from "../constants/formOptions/animalReactions";
import Checkbox from "./formFields/Checkbox/Checkbox";
import fieldStyles from "./formFields/fieldStyles";

const styles = {
  doubleGrid: css`
    grid-column: span 2;
  `,
  checkboxes: css`
    display: inline-flex;
    padding-right: 100px;
    flex-wrap: wrap;
  `
};

const AnimalReactionFormSection = ({ isViewOnly, subject }) => {
  return (
    
      <div css={styles.doubleGrid}>
        <label css={fieldStyles.label}>Behaviour</label>
        <div css={styles.checkboxes}>
        {animalReactions.map((reaction) => (
          <Checkbox
            key={subject+"-"+reaction}
            name={subject+"-"+reaction}
            labelText={reaction}
            isDisabled={isViewOnly}
          ></Checkbox>
        ))}
        </div>
      </div>
  );
};

export default AnimalReactionFormSection;
