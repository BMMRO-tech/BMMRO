/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";

const ErrorMessage = ({ text, isInline = false }) => {
  const styles = {
    error: css`
      display: ${isInline ? "inline" : "block"};
      color: ${colors.red};
    `,
  };

  return <div css={styles.error}>{text}</div>;
};

export default ErrorMessage;
