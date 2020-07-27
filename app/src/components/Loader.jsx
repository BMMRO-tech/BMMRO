/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Loading from "./icons/Loading";

const Loader = () => {
  const styles = css`
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;

    animation-name: spin;
    animation-duration: 4000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    svg {
      height: 100px;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(-360deg);
      }
    }
  `;

  return (
    <span css={styles} role="img" aria-label="loading">
      <Loading />
    </span>
  );
};

export default Loader;
