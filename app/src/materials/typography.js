import { css } from "@emotion/core";
import colors from "./colors";

const typography = {
  title: css`
    margin: 0;
    color: ${colors.darkBlue};
    font-size: 20px;
    font-weight: 600;
    text-transform: uppercase;
  `,
  text: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 18px;
    font-weight: 400;
  `,
  caption: css`
    margin: 0;
    display: block;
    color: ${colors.darkGray};
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  `,
};

export default typography;
