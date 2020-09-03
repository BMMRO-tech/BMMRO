/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../../materials/colors";
import typography from "../../materials/typography";

const ListHeader = ({ title, children }) => {
  const styles = {
    listHeader: css`
      margin-top: 20px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: ${colors.lightTurquoise};
    `,
    title: css`
      ${typography.largeText}
      font-weight: 600;
    `,
  };

  return (
    <div css={styles.listHeader}>
      <h2 css={styles.title}>{title}</h2>
      {children}
    </div>
  );
};

export default ListHeader;
