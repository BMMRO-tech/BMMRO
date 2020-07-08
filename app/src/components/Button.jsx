/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import appStyles from "../materials/appStyles";

const Button = ({
  type,
  disabled,
  children,
  testId,
  onClick,
  width = "auto",
}) => {
  const styles = css`
    background: ${appStyles.colors.darkBlue};
    border: none;
    color: white;
    font-size: 15px;
    padding: 10px 15px;
    margin-right: 10px;
    width: ${width};

    &:disabled {
      background: darkgrey;
    }
  `;
  return (
    <button
      css={styles}
      type={type}
      disabled={disabled}
      data-testid={testId}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
