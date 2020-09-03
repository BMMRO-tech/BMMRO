/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../../materials/colors";
import typography from "../../materials/typography";

const ListHeader = ({ title, children }) => {
  const styles = {
    listHeader: css`
      margin-top: 20px;
      width: 100%;
    `,
    title: css`
      background: ${colors.lightTurquoise};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      ${typography.largeText}
      font-weight: 600;
    `,
  };

  return (
    <section css={styles.listHeader}>
      <h2 css={styles.title}>{title}</h2>
      {children}
    </section>
  );
};

export default ListHeader;
