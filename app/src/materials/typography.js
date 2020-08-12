import { css } from "@emotion/core";
import colors from "./colors";

const typography = {
  title: css`
    margin: 0;
    color: ${colors.darkTurquoise};
    font-size: 22px;
    font-weight: 600;
    text-transform: uppercase;
  `,
  largeText: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 18px;
    font-weight: 500;
  `,
  mediumText: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 16px;
    font-weight: 400;
  `,
  smallText: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 14px;
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
