/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";
import breakPoints from "../materials/breakPoints";

const Button = ({
  type,
  disabled,
  children,
  testId,
  onClick,
  variant = "primary",
  width = "auto",
  styles,
  isSmall,
}) => {
  const basicStyles = css`
    ${styles}
    display: block;
    min-width: 95px;
    font-size: 15px;
    width: ${width};
    padding: ${isSmall ? 0 : "0 10px"};
    height: ${isSmall ? "36px" : "44px"};
    border-radius: 2px;
    font-weight: 600;
    max-width: fit-content;

    &:disabled {
      background: ${colors.mediumGray};
      border: 1px solid ${colors.mediumGray};
    }

    @media (min-width: ${breakPoints.maxPhone}) {
      min-width: ${isSmall ? "100px" : "150px"};
      max-width: none;
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
