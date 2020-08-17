/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../../materials/colors";

const styles = {
  loadMoreButton: css`
    background: white;
    padding: 20px;
    margin: 0;
    color: ${colors.darkTurquoise};
    font-size: 16px;
    font-weight: 600;
    width: 100%;
    border: none;
    border-top: 1px solid ${colors.lightGray};

    &:disabled {
      color: ${colors.lightGray};
    }
  `,
};

const LoadMoreButton = ({ handleClick, hasMaxItems }) => {
  return (
    <button
      disabled={hasMaxItems}
      onClick={handleClick}
      css={styles.loadMoreButton}
    >
      Load more
    </button>
  );
};

export default LoadMoreButton;
