import { css } from "@emotion/react";
import colors from "../../materials/colors";
import typography from "../../materials/typography";

const fieldStyles = {
  doubleGrid: css`
    grid-column: span 2;
  `,
  label: css`
    span {
      float: left;
      display: block;
      padding-bottom: 5px;
    }

    &:focus-within {
      span {
        font-weight: 700;

        &:first-of-type {
          color: ${colors.darkTurquoise};
        }
      }

      select {
        outline: 2px solid ${colors.mediumTurquoise};
      }

      input {
        outline: 2px solid ${colors.mediumTurquoise};
      }

      textarea {
        outline: 2px solid ${colors.mediumTurquoise};
      }
    }
  `,
  required: css`
    color: ${colors.darkRed};
    margin-left: 5px;
  `,
  longRequired: css`
    color: ${colors.darkRed};
    margin-left: 5px;
    grid-column: 1 / 3;
    font-size: 13px;
  `,
  inputContainer: css`
    display: inline-block;
    width: 100%;
  `,
  checkboxLabel: css`
    ${typography.smallText}
    display: flex;
    align-items: center;
  `,
  checkboxInput: css`
    margin: 0 3px 0 0;
    min-height: 44px;
  `,
  getInputStyles: (error, touched, isShort, isDouble) => css`
    width: ${isShort ? "50%" : "100%"};
    max-width: ${isDouble ? null : isShort ? "200px" : "400px"};
    min-height: ${isDouble ? "100px" : null};
    margin-right: 5px;
    padding: 5px;
    font-size: 16px;
    border: 1px solid ${!!error && touched ? colors.darkRed : colors.mediumGray};
    border-radius: 2px;
    background: ${colors.white};

    :disabled {
      background: ${colors.lightGray};
      opacity: 1;
      color: ${colors.darkGray};
    }
  `,
};

export default fieldStyles;
