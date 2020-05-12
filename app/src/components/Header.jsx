/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../materials/colors";

const Header = () => {
  const styles = {
    header: css`
      min-height: 50px;
      box-shadow: 6px 1px 5px 1px rgba(40, 54, 104, 0.15);
    `,
    container: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 740px;
      margin: 0 auto;
      padding: 10px;
    `,
    logo: css`
      height: 40px;
      width: auto;
    `,
    text: css`
      font-weight: bold;
      font-size: 30px;
      color: ${colors.lightBlue};
    `,
  };
  return (
    <header css={styles.header}>
      <div css={styles.container}>
        <span css={styles.text}>BMMRO</span>
        <svg
          css={styles.logo}
          viewBox="0 0 71 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#0CF" fill-rule="evenodd">
            <path
              d="M53.76 62.63c-1.99.77-4.43.99-5.94 1.18-.88.1-1.75.27-2.63.4l-1.73.28c-1.55.25-3.38.49-4.97.49-1.05 0-2.15.1-3.18-.14-.33-.08-.68-.54-.9-.76-.82-.82-1.3-1.48-.82-2.69.06-.15.32.02.48.07.58.18 1.19.31 1.8.35.15-.58.05-.6.4-1.8.15.02 1.6 1.19 2.08 1.31.05-.43 0-.68.21-1.65.01-.06 2.45 1.3 2.49 1.17.22-.7.22-.7.2-1.45 1.45 1.1 1.1.86 2.42 1.52 0-.74 0-.05.28-2 .76.44 1.24.83 2 .83.45-.55.67-.58.67-1.4-.03.26.73 0 2.03 1.12.22-.56.42-1.04.48-1.58.39.34.74.5.97.62.47-.24.42-.34.9-.42.29-.05.6 0 .9 0 2.48 0-.56.03 1.93-.07 5.13-1.18 7.56-1.48 10.7-2.55-3.65.01-8.02.74-11.4 1.71-1.47 0-3.42-.16-4.72 0-7.74 1.58-15.14 2.1-23.9.61-2.74-.7-5.43-4.25-7.8-5.74-3.14-1.19-5.69-3.09-8.23-4.37-2.36-1.5-5.9-2.75-7.35-7.01C-.62 35.52.02 33.18.67 27.29c.48-5.09.8-6.3 3.17-13.03C5.46 10.93 4.99 8.27 7.6 5.1a11.77 11.77 0 015.35-3.5c2.74-.75 4.2-.57 7.7-.57h11.9l.08 24.2h12.53V37.3H71l-.1 24.94s-12.09-.6-17.14.38z"
              fill-rule="nonzero"
            />
            <path d="M34 1h11v11H34zM47 13h11v11H47zM47 1h11v11H47zM60 13h11v11H60zM60 1h11v11H60zM60 25h11v11H60zM34 13h11v11H34zM47 25h11v11H47z" />
          </g>
        </svg>
      </div>
    </header>
  );
};

export default Header;
