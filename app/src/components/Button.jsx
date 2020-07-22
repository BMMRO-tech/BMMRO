/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import appStyles from "../materials/appStyles";

const Button = ({
  type,
  disabled,
  children,
  testId,
  onClick,
  variant = "primary",
  width = "auto",
}) => {
  const basicStyles = css`
    border: 1px solid ${appStyles.colors.darkBlue};
    font-size: 15px;
    padding: 10px 15px;
    margin-right: 10px;
    width: ${width};

    &:disabled {
      background: darkgrey;
    }
  `;

  const variantStyles = {
    primary: css`
      ${basicStyles}
      background: ${appStyles.colors.darkBlue};
      color: ${appStyles.colors.white};
    `,
    secondary: css`
      ${basicStyles}
      background: ${appStyles.colors.white};
      color: ${appStyles.colors.darkBlue};
    `,
  };

  return (
    <button
      css={
        variant === "secondary"
          ? variantStyles.secondary
          : variantStyles.primary
      }
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
