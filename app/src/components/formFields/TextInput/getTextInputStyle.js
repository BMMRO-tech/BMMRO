import { css } from "@emotion/core";
import colors from "../../../materials/colors";

const getTextInputStyle = (error, touched) => {
  return {
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
    input: css`
      width: 100%;
      max-width: 100%;
      margin-right: 5px;
      padding: 5px;
      font-size: 16px;
      border: 1px solid
        ${!!error && touched ? colors.darkRed : colors.mediumGray};
      border-radius: 2px;
    `,
  };
};

export default getTextInputStyle;
