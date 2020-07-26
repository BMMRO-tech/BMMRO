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
  styles,
}) => {
  const basicStyles = css`
    ${styles}
    display: block;
    min-width: 150px;
    font-size: 16px;
    padding: 10px 20px;
    width: ${width};
    border-radius: 2px;
    font-weight: 600;

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
