/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import ListSubheader from "./list/ListSubheader";
import utilities from "../materials/utilities";

const styles = {
  legend: css`
    width: 100%;
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
          <ListSubheader title={legendText} />
        </legend>
      )}
      <div css={fieldsLayout}>{children}</div>
    </fieldset>
  );
};

export default FormSection;
