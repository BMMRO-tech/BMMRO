/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import utilities from "../materials/utilities";
import colors from "../materials/colors";
import { useFormikContext } from "formik";

const FormSection = ({
  legendText,
  isOneLine,
  isOneLine4Elements,
  children,
  id,
  errorFieldName,
}) => {
  const { errors } = useFormikContext();
  const hasSectionError = errorFieldName && !!errors[errorFieldName];

  const fieldsLayout = isOneLine
    ? [utilities.form.subsection, utilities.form.oneLine3ElementsFieldsGrid]
    : isOneLine4Elements
    ? [utilities.form.subsection, utilities.form.oneLine4ElementsFieldsGrid]
    : [utilities.form.subsection, utilities.form.fieldsGrid];

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
    errorBorder: css`
      border: ${hasSectionError ? `1px solid ${colors.darkRed}` : "none"};
    `,
  };
  return (
    <fieldset id={id} css={[utilities.form.fieldset, styles.errorBorder]}>
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
