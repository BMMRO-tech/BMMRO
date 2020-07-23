import { css } from "@emotion/core";
import colors from "../../../materials/colors";

const getDateInputStyle = (error, touched) => {
  return {
    label: css`
      display: block;
      padding-bottom: 5px;
    `,
    input: css`
      width: 100%;
      max-width: 100%;
      margin-right: 5px;
      padding: 5px;
      font-size: 15px;
      border: 1px solid ${!!error && touched ? colors.red : colors.lightBlue};
    `,
  };
};

export default getDateInputStyle;
