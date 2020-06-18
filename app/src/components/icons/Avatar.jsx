/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../../materials/colors";

const styles = {
  avatar: css`
    height: 40px;
  `,
};

export const Avatar = ({ handleClick }) => {
  return (
    <svg
      onClick={handleClick}
      css={styles.avatar}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 8.4666667 8.4666667"
      version="1.1"
      data-name="avatar"
      data-url="https://thenounproject.com/search/?q=avatar&i=2309777"
      data-attribution="avatar by Nawicon from the Noun Project"
    >
      <g transform="translate(0,-288.53333)" fill={colors.lightBlue}>
        <path d="m 4.2333328,289.0625 c -2.0426203,0 -3.70416669,1.66154 -3.70416669,3.70416 0,2.04262 1.66154639,3.70417 3.70416669,3.70417 2.0426204,0 3.7041667,-1.66155 3.7041667,-3.70417 0,-2.04262 -1.6615463,-3.70416 -3.7041667,-3.70416 z m 0,1.32291 c 0.7274931,0 1.3229167,0.59543 1.3229167,1.32292 0,0.72749 -0.5954236,1.32292 -1.3229167,1.32292 -0.727493,0 -1.3229166,-0.59543 -1.3229166,-1.32292 0,-0.72749 0.5954236,-1.32292 1.3229166,-1.32292 z m -1.0583333,3.175 h 2.1166667 c 0.7223866,0 1.3123042,0.58516 1.3218821,1.30535 -0.5812948,0.65895 -1.4301126,1.0759 -2.3802155,1.0759 -0.9501055,0 -1.7989206,-0.41695 -2.3802181,-1.0759 0.00958,-0.72019 0.5994956,-1.30535 1.3218848,-1.30535 z" />
      </g>
    </svg>
  );
};
