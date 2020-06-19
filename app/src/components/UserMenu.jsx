/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import Logout from "./Logout";
import { Avatar } from "./icons/Avatar";

const styles = {
  menuAvatar: css`
    background-color: transparent;
    border: none;
    &:focus {
      outline: none;
    }
  `,
  menuList: css`
    padding: 10px;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0.5px 1px 1.5px 2px rgba(40, 54, 104, 0.15);
    max-width: 300px;
    &:focus {
      outline: none;
    }
  `,
  menuItem: css`
    cursor: unset;
    &:hover {
      background-color: transparent;
      color: unset;
    }
  `,
};

const UserMenu = () => {
  return (
    <Menu>
      <MenuButton css={styles.menuAvatar}>
        <Avatar />
      </MenuButton>

      <MenuList css={styles.menuList}>
        <MenuItem css={styles.menuItem} onSelect={() => {}}>
          <Logout />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
