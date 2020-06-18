/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../materials/colors";
import Logo from "../components/Logo";

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
        <Logo />
      </div>
    </header>
  );
};

export default Header;
