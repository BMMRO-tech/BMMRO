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
}) => {
  const basicStyles = css`
    font-size: 15px;
    padding: 10px 15px;
    margin-right: 10px;
    width: ${width};
    border-radius: 2px;

    &:disabled {
      background: darkgrey;
    }
  `;

  const variantStyles = {
    primary: css`
      ${basicStyles}
      background: ${colors.mediumTurquoise};
      color: ${colors.white};
      border: 1px solid ${colors.mediumTurquoise};
    `,
    secondary: css`
      ${basicStyles}
      background: ${colors.white};
      color: ${colors.darkTurquoise};
      border: 1px solid ${colors.darkTurquoise};
    `,
    warning: css`
      ${basicStyles}
      background: ${colors.darkRed};
      color: ${colors.white};
      border: 1px solid ${colors.darkRed};
    `,
    neutral: css`
      ${basicStyles}
      background: ${colors.white};
      color: ${colors.darkGray};
      border: 1px solid ${colors.darkGray};
    `,
  };

  return (
    <button
      css={variantStyles[variant]}
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
