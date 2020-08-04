import { css } from "@emotion/core";
import colors from "../../../materials/colors";

const getTimeInputStyle = (error, touched, isShort) => {
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
      width: ${isShort ? "50%" : "100%"};
      max-width: ${isShort ? "200px" : "400px"};
      margin-right: 5px;
      padding: 5px;
      font-size: 16px;
      border: 1px solid
        ${!!error && touched ? colors.darkRed : colors.mediumGray};
      border-radius: 2px;
    `,
  };
};

export default getTimeInputStyle;
