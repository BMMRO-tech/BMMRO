/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import colors from "../../materials/colors";
import typography from "../../materials/typography";

const ListSubheader = ({ title }) => {
  const styles = {
    section: css`
      ${typography.smallTitle}
      background-color: ${colors.lightestTurquoise};
      padding: 5px 10px;
      display: flex;
      align-items: center;
    `,
  };

  return <div css={styles.section}>{title}</div>;
};

export default ListSubheader;
