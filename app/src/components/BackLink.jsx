/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";

import colors from "../materials/colors";
import { LeftArrow } from "./icons/LeftArrow";

const styles = {
  link: css`
    font-size: 16px;
    font-weight: 600;
    color: ${colors.darkTurquoise};
    display: flex;
  `,
  arrow: css`
    margin-right: 5px;
    display: flex;
    align-items: center;

    svg {
      height: 10px;
      fill: ${colors.darkTurquoise};
      stroke: ${colors.darkTurquoise};
      stroke-width: 2;
    }
  `,
};

const BackLink = ({ text, to }) => {
  return (
    <Link css={styles.link} to={to} id="backLink">
      <span css={styles.arrow}>
        <LeftArrow />
      </span>
      <span>{text}</span>
    </Link>
  );
};

export default BackLink;
