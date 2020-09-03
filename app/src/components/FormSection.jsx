/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import ListSubheader from "./list/ListSubheader";
import utilities from "../materials/utilities";

const styles = {
  legend: css`
    width: 100%;
  `,
};
const FormSection = ({ legendText, children }) => {
  return (
    <fieldset css={utilities.form.fieldset}>
      {legendText && (
        <legend css={styles.legend}>
          <ListSubheader title={legendText} />
        </legend>
      )}
      <div css={utilities.form.subsection}>{children}</div>
    </fieldset>
  );
};

export default FormSection;
