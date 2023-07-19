/** @jsxImportSource @emotion/react */

import { css, jsx } from "@emotion/react";
import colors from "../../materials/colors";

const FieldError = ({ touched, errorMessage, labelText, isRequired }) => {
  const shouldDisplayError =
    (isRequired && touched && errorMessage) || (!isRequired && errorMessage)
      ? true
      : false;

  const styles = {
    error: css`
      color: ${colors.darkRed};
      font-size: 13px;
      display: ${shouldDisplayError ? "block" : "none"};
    `,
    container: css`
      margin-top: 3px;
      min-height: 20px;
    `,
  };

  return (
    <div css={styles.container}>
      <div role="alert" aria-label={labelText} css={styles.error}>
        {errorMessage}
      </div>
    </div>
  );
};

export default FieldError;
