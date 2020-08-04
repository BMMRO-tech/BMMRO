import { css } from "@emotion/core";
import colors from "../../materials/colors";

const fieldStyles = {
  label: css`
    span {
      float: left;
      display: block;
      padding-bottom: 5px;
    }

    &:focus-within {
      span {
        color: ${colors.darkTurquoise};
        font-weight: 700;
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
  inputContainer: css`
    display: inline-block;
    width: 100%;
  `,
  getInputStyles: (error, touched, isShort) => css`
    width: ${isShort ? "50%" : "100%"};
    max-width: ${isShort ? "200px" : "400px"};
    margin-right: 5px;
    padding: 5px;
    font-size: 16px;
    border: 1px solid ${!!error && touched ? colors.darkRed : colors.mediumGray};
    border-radius: 2px;
  `,
};

export default fieldStyles;
