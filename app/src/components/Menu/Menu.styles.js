import { css } from "@emotion/core";

export const menuStyles = {
  menuButton: css`
    background-color: transparent;
    border: none;
    &:focus {
      outline: none;
    }
  `,
  mask: css`
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 5;
    background-color: transparent;
    width: 99vw;
    height: 100vh;
  `,
  menu: css`
    top: 56px;
    right: 10px;
    position: absolute;
    background-color: white;
    padding: 20px;
    box-shadow: 0.5px 1px 1.5px 2px rgba(40, 54, 104, 0.15);
    z-index: 10;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 740px) {
      max-width: 500px;
      /* padding on the right outside of the container
      device width - container width = padding on both sides */
      right: calc((100vw - 740px) / 2);
    }
  `,
};
