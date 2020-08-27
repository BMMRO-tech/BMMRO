import { css } from "@emotion/core";
import colors from "../../../materials/colors";

const getRadioGroupStyle = () => {
  return {
    radioGroupContainer: css`
      margin-bottom: 20px;
    `,
    label: css`
      span {
        display: block;
        padding-bottom: 5px;
      }
    `,
    radioLabel: css`
      display: inline-flex;
      align-items: center;
      margin-right: 15px;
      min-width: 44px;
      min-height: 44px;
    `,
    radioButton: css`
      margin-right: 5px;
      margin-left: 0;
      -webkit-appearance: none;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      outline: none;
      border: 2px solid ${colors.darkGray};

      :before {
        content: "";
        display: block;
        width: 5px;
        height: 5px;
        margin-top: 3px;
        margin-left: 3px;
        border-radius: 50%;
      }

      :checked:before {
        background: ${colors.darkGray};
      }

      :checked {
        border-color: ${colors.darkGray};
      }

      :disabled {
        background: ${colors.lightGray};
      }
    `,
  };
};

export default getRadioGroupStyle;
