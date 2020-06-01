/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../materials/colors";

const Button = ({ type, disabled, children, testId }) => {
  const styles = css`
    background: ${colors.darkBlue};
    border: none;
    color: white;
    font-size: 15px;
    padding: 10px 15px;

    &:disabled {
      background: darkgrey;
    }
  `;
  return (
    <button css={styles} type={type} disabled={disabled} data-testid={testId}>
      {children}
    </button>
  );
};

export default Button;
