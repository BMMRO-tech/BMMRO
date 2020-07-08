/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import appStyles from "../../materials/appStyles";

const avatarStyles = {
  avatar: css`
    height: 40px;
  `,
};

export const Avatar = ({ handleClick }) => {
  return (
    <svg
      onClick={handleClick}
      fill={appStyles.colors.lightBlue}
      css={avatarStyles.avatar}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 100 100"
    >
      <g>
        <path d="M48.6,20.7c-8.3,0-15.1,6.8-15.1,15.1c0,8.3,6.8,15.1,15.1,15.1c8.3,0,15.1-6.8,15.1-15.1   C63.7,27.5,56.9,20.7,48.6,20.7z M48.6,4.7C24.1,4.7,4.2,24.5,4.2,49s19.9,44.3,44.3,44.3S92.9,73.5,92.9,49S73,4.7,48.6,4.7z    M48.6,53.9c-14.1,0-26.2,8.1-32.2,19.8C11.1,66.8,7.9,58.3,7.9,49c0-22.4,18.2-40.6,40.6-40.6C71,8.4,89.2,26.6,89.2,49   c0,9.3-3.2,17.9-8.5,24.8C74.8,62,62.6,53.9,48.6,53.9z"></path>
      </g>
    </svg>
  );
};
