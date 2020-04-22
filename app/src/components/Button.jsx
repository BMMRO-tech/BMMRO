/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../materials/colors";

const Button = ({ type, children }) => {
  const styles = css`
    background: ${colors.darkBlue};
    border: none;
    color: white;
    font-size: 15px;
    padding: 10px 15px;
  `;
  return (
    <button css={styles} type={type}>
      {children}
    </button>
  );
};

export default Button;
