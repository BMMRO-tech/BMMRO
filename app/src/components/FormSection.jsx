/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import utilities from "../materials/utilities";
import colors from "../materials/colors";

const styles = {
  legend: css`
    width: 100%;
    background-color: ${colors.white};
    padding-top: 10px;
  `,
  section: css`
    color: ${colors.darkGray};
    font-weight: 600;
    padding: 5px 10px;
    display: flex;
    align-items: center;
  `,
};

const FormSection = ({ legendText, isOneLine, children }) => {
  const fieldsLayout = isOneLine
    ? [utilities.form.subsection, utilities.form.oneLineFieldsGrid]
    : [utilities.form.subsection, utilities.form.fieldsGrid];

  return (
    <fieldset css={utilities.form.fieldset}>
      {legendText && (
        <legend css={styles.legend}>
          <div css={styles.section}>{legendText}</div>
        </legend>
      )}
      <div css={fieldsLayout}>{children}</div>
    </fieldset>
  );
};

export default FormSection;
