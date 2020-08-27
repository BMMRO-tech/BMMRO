/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";

import typography from "../materials/typography";
import colors from "../materials/colors";
import { LeftArrow } from "./icons/LeftArrow";

const styles = {
  link: css`
    ${typography.largeText}
    font-weight: 600;
    color: ${colors.darkTurquoise};
    display: flex;
  `,
  arrow: css`
    margin-right: 5px;
    display: flex;
    align-items: center;

    svg {
      height: 15px;
      fill: ${colors.darkTurquoise};
      stroke: ${colors.darkTurquoise};
      stroke-width: 2;
    }
  `,
};

const BackLink = ({ text, to }) => {
  return (
    <Link css={styles.link} to={to}>
      <span css={styles.arrow}>
        <LeftArrow />
      </span>
      <span>{text}</span>
    </Link>
  );
};

export default BackLink;
