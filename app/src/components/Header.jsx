/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";
import containers from "../materials/containers";
import { Avatar } from "./icons/Avatar";
import Logout from "./Logout";
import Menu from "./Menu/Menu";

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
  logo: css`
    height: 40px;
    width: 40px;
  `,
};

const Header = () => {
  return (
    <header css={styles.header}>
      <div css={styles.container}>
        <img
          css={styles.logo}
          src={process.env.PUBLIC_URL + "/logo192.png"}
          alt="BMMRO logo"
        />
        <span css={styles.text}>BMMRO</span>
        <Menu menuButtonComponent={<Avatar />} menuItems={[<Logout />]} />
      </div>
    </header>
  );
};

export default Header;
