/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../../materials/colors";

const FieldError = ({ errorMessage, labelText }) => {
  const styles = {
    error: css`
      color: ${colors.darkRed};
      font-size: 13px;
      display: ${errorMessage ? "block" : "none"};
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
