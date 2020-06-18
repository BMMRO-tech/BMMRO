/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../materials/colors";
import UserMenu from "./UserMenu";
import Logo from "./icons/Logo";

const styles = {
  header: css`
    min-height: 50px;
    box-shadow: 6px 1px 5px 1px rgba(40, 54, 104, 0.15);
  `,
  container: css`
    display: flex;
    align-items: center;
    max-width: 740px;
    margin: 0 auto;
    padding: 10px;
  `,
  text: css`
    font-weight: bold;
    font-size: 30px;
    margin-right: auto;
    margin-left: 10px;
    color: ${colors.lightBlue};
  `,
};

const Header = () => {
  return (
    <header css={styles.header}>
      <div css={styles.container}>
        <Logo />
        <span css={styles.text}>BMMRO</span>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
