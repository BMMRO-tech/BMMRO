/** @jsx jsx */
import { jsx } from "@emotion/core";
import { menuStyles } from "./Menu.styles";
import { Fragment, useState } from "react";

const UserMenu = ({ menuButtonComponent, menuItems }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Fragment>
      <button
        css={menuStyles.menuButton}
        aria-label="Open menu"
        onClick={() => setShowMenu(true)}
        aria-haspopup={true}
      >
        {menuButtonComponent}
      </button>

      {showMenu && (
        <Fragment>
          <div
            css={menuStyles.mask}
            onClick={() => setShowMenu(false)}
            data-testid="menu-mask"
          />
          <div css={menuStyles.menu} role="menu">
            {menuItems.map((menuItem, index) => (
              <div role="menuitem" key={index}>
                {menuItem}
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserMenu;
