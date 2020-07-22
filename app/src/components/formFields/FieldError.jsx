/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../../materials/colors";

const styles = {
  error: css`
    color: ${colors.red};
    font-size: 13px;
  `,
  container: css`
    margin-top: 3px;
    min-height: 20px;
  `,
};

const FieldError = ({ touched, errorMessage, labelText }) => {
  return (
    <div css={styles.container}>
      {touched && (
        <div role="alert" aria-label={labelText} css={styles.error}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default FieldError;
