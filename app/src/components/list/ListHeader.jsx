/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../../materials/colors";
import typography from "../../materials/typography";

const ListHeader = ({ title, children }) => {
  const styles = {
    listHeader: css`
      background: ${colors.lightTurquoise};
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px;
      margin-top: 20px;
    `,
    title: css`
      ${typography.largeText}
      font-weight: 600;
    `,
  };

  return (
    <div css={styles.listHeader}>
      <p css={styles.title}>{title}</p>
      {children}
    </div>
  );
};

export default ListHeader;
