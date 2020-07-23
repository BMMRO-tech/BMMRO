import { css } from "@emotion/core";
import colors from "../../../materials/colors";

const getTextInputStyle = (error, touched) => {
  return {
    label: css`
      display: block;
      padding-bottom: 5px;
    `,
    select: css`
      width: 100%;
      margin-right: 5px;
      padding: 5px;
      font-size: 15px;
      background: ${colors.white};
      border-radius: 0;
      border: 1px solid ${!!error && touched ? colors.red : colors.lightBlue};
    `,
  };
};

export default getTextInputStyle;
