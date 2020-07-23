/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../../materials/colors";

const FieldError = ({ touched, errorMessage, labelText }) => {
  const styles = {
    error: css`
      color: ${colors.red};
      font-size: 13px;
      display: ${touched && errorMessage ? "block" : "none"};
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
