import { css } from "@emotion/core";

import breakPoints from "./breakPoints";
import typography from "./typography";
import colors from "./colors";

const utilities = {
  form: {
    container: css`
      padding: 0 20px;

      section {
        background-color: ${colors.white};

        fieldset:first-of-type {
          > legend {
            padding-top: 20px;
          }
        }
      }
    `,
    fieldsGrid: css`
      @media (min-width: ${breakPoints.maxPhone}) {
        display: grid;
        grid-template-columns: 45% 45%;
        grid-column-gap: 10%;
      }
    `,
    oneLineFieldsGrid: css`
      @media (min-width: ${breakPoints.maxPhone}) {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
      }
    `,
    title: css`
      ${typography.title}
      background-color: ${colors.lighterGray};
      padding: 10px;
    `,
    legend: css`
      font-size: 14px;

      span {
        color: ${colors.darkRed};
        margin-right: 5px;
      }
    `,
    fieldset: css`
      border: none;
      margin: 0;
      padding: 0;
    `,
    subsection: css`
      padding: 20px 10px 10px;
      @media (min-width: ${breakPoints.maxPhone}) {
        display: flex;
      }
    `,
  },
  sticky: {
    contentContainer: css`
      margin-bottom: 20px;

      @media (min-width: ${breakPoints.mediumTablet}) {
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
      min-height: 64px;
      z-index: 999;

      @media (min-width: ${breakPoints.mediumTablet}) {
        position: relative;
        bottom: auto;
        background: none;
        box-shadow: none;
      }
    `,
  },
  backLinkContainer: {
    top: css`
      margin-bottom: 20px;
      padding-left: 10px;
    `,
    bottom: css`
      display: flex;
      justify-content: center;
      margin-top: 20px;
    `,
  },
  list: {
    items: css`
      list-style-type: none;
      padding: 0;
      margin: 0;

      a:last-child {
        li {
          border-bottom: none;
        }
      }
    `,
    container: css`
      background: white;

      ul:first-of-type {
        > div {
          margin-top: 20px;
        }
      }

      ul:last-child {
        border-bottom: 1px solid ${colors.lightGray};
      }
    `,
    noEntries: css`
      padding: 20px;
      margin: 0;
      font-style: italic;
    `,
  },
};

export default utilities;
