/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import colors from "../materials/colors";
import containers from "../materials/containers";
import { Avatar } from "./icons/Avatar";
import BMMROLogo from "./icons/BMMROLogo";
import Logout from "./Logout";
import Menu from "./Menu/Menu";
import PendingIndicator from "./PendingIndicator";

const styles = {
  header: css`
    min-height: 50px;
    box-shadow: 0 1px 5px 1px rgba(40, 54, 104, 0.15);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: ${colors.white};
  `,
  container: css`
    display: flex;
    align-items: center;
    max-width: ${containers.default};
    margin: 0 auto;
    padding: 10px;
  `,
  text: css`
    font-weight: bold;
    font-size: 30px;
    margin-right: auto;
    margin-left: 10px;
    color: ${colors.darkGray};
  `,
};

const Header = () => {
  return (
    <header css={styles.header}>
      <div css={styles.container}>
        <BMMROLogo />
        <span css={styles.text}>BMMRO</span>
        <PendingIndicator />
        <Menu menuButtonComponent={<Avatar />} menuItems={[<Logout />]} />
      </div>
    </header>
  );
};

export default Header;
