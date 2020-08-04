import { css } from "@emotion/core";

import breakPoints from "./breakPoints";
import typography from "./typography";
import colors from "./colors";

const utilities = {
  form: {
    container: css`
      padding: 0 20px;
    `,
    fieldsGrid: css`
      @media (min-width: ${breakPoints.maxPhone}) {
        display: grid;
        grid-template-columns: 45% 45%;
        grid-column-gap: 10%;
      }
    `,
    title: css`
      ${typography.title}
      background-color: ${colors.lighterGray};
      padding: 10px;
      margin-bottom: 15px;
    `,
    legend: css`
      font-size: 14px;

      span {
        color: ${colors.darkRed};
        margin-right: 5px;
      }
    `,
  },
  sticky: {
    contentContainer: css`
      margin-bottom: 80px;

      @media (min-width: ${breakPoints.maxPhone}) {
        margin-bottom: 0;
      }
    `,
    footerContainer: css`
      display: flex;
      justify-content: center;
      margin-top: 10px;
      position: fixed;
      bottom: 0;
      background: white;
      width: 100%;
      padding: 10px;
      box-shadow: 0 -1px 5px 1px rgba(40, 54, 104, 0.15);
      left: 0;

      @media (min-width: ${breakPoints.maxPhone}) {
        position: relative;
        bottom: auto;
        background: none;
        box-shadow: none;
      }
    `,
  },
};

export default utilities;
