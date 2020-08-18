import { css } from "@emotion/core";
import colors from "./colors";

const typography = {
  largeTitle: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 24px;
    font-weight: 600;
    text-transform: uppercase;
  `,
  title: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 22px;
    font-weight: 600;
    text-transform: uppercase;
  `,
  smallTitle: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
  `,
  largeText: css`
    margin: 0;
    color: ${colors.darkGray};
    font-size: 18px;
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
    font-size: 13px;
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
