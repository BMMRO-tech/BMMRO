import { css } from "@emotion/core";
import colors from "../../../materials/colors";

const getTextAreaInputStyle = (error, touched) => {
  return {
    label: css`
      span {
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

export default getTextAreaInputStyle;
