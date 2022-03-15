import { css } from "@emotion/core";

import breakPoints from "./breakPoints";
import typography from "./typography";
import colors from "./colors";
import containers from "./containers";

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
      background-color: ${colors.white};
    `,
    subsection: css`
      padding: 10px;
      @media (min-width: ${breakPoints.maxPhone}) {
        display: flex;
      }
    `,
  },
  sticky: {
    contentContainer: css`
      margin-bottom: 0;
    `,
    footerContainer: css`
      display: flex;
      justify-content: center;
      position: sticky;
      bottom: 0;
      background: ${colors.lighterGray};
      z-index: 999;
      padding: 10px;

      @media (min-width: ${breakPoints.maxPhone}) {
        justify-content: space-between;
        padding: 10px 0;
      }
    `,
    rightContainer: css`
      display: flex;
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
  confirmationModal: {
    overlayBackground: css`
      background-color: rgba(0, 0, 0, 0.5);
    `,
    overlay: css`
      z-index: 9999;
    `,
    modal: css`
      position: fixed;
      background-color: white;
      display: block;
      padding: 20px;
      min-width: 90%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      @media (min-width: ${breakPoints.mediumTablet}) {
        min-width: auto;
      }
    `,
    modalHeaderContainer: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      @media (min-width: ${breakPoints.maxPhone}) {
        flex-direction: row;
      }
    `,
    modalHeader: css`
      text-align: center;
      font-weight: bold;
      padding-top: 5px;

      @media (min-width: ${breakPoints.maxPhone}) {
        padding-top: 0;
      }
    `,
    modalDescription: css`
      padding: 20px 0;
    `,
    modalDescriptionList: css`
      margin: 0;
      li:not(:first-child) {
        margin-top: 10px;
      }
    `,
    modalButtons: css`
      display: flex;
      justify-content: space-between;
    `,
  },
  header: {
    clearButton: css`
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      padding: 0;
    `,
    mask: css`
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: fixed;
      z-index: 5;
      background-color: transparent;
      width: 99vw;
      height: 100vh;
    `,
    popupContainer: css`
      top: 56px;
      right: 10px;
      position: absolute;
      background-color: white;
      padding: 20px;
      box-shadow: 0.5px 1px 1.5px 2px rgba(40, 54, 104, 0.15);
      z-index: 10;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (min-width: ${containers.default}) {
        max-width: 500px;
        /* padding on the right outside of the container
      device width - container width = padding on both sides */
        right: calc((100vw - ${containers.default}) / 2);
      }
    `,
  },
};

export default utilities;
