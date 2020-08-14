/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import colors from "../../materials/colors";
import typography from "../../materials/typography";

const ListSubheader = ({ title }) => {
  const styles = {
    section: css`
      background-color: ${colors.lightestTurquoise};
      ${typography.mediumText}
      padding-left: 10px;
      text-transform: uppercase;
    `,
  };

  return title ? <div css={styles.section}>{title}</div> : null;
};

export default ListSubheader;
