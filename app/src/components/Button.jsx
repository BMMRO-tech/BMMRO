/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";

const Button = ({
  type,
  disabled,
  children,
  testId,
  onClick,
  variant = "primary",
  width = "auto",
  primaryBackgroundColor = colors.darkBlue,
}) => {
  const basicStyles = css`
    border: 1px solid ${colors.darkBlue};
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
      background: ${primaryBackgroundColor};
      color: ${colors.white};
    `,
    secondary: css`
      ${basicStyles}
      background: transparent;
      color: ${colors.darkBlue};
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
