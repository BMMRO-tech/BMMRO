/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
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
  `,
};

const AnimalReactionFormSection = ({ isViewOnly, subject }) => {
  return (
    <div css={styles.doubleGrid}>
      <label css={fieldStyles.label}>Behaviour</label>
      <div css={styles.checkboxes}>
        {animalReactions.map((reaction) => (
          <Checkbox
            key={subject + "Behaviour." + reaction.replace(/\s/g, "")}
            name={subject + "Behaviour." + reaction.replace(/\s/g, "")}
            labelText={reaction.charAt(0).toUpperCase() + reaction.slice(1)}
            isDisabled={isViewOnly}
          ></Checkbox>
        ))}
      </div>
    </div>
  );
};

export default AnimalReactionFormSection;
