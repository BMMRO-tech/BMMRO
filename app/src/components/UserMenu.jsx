/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment, useState } from "react";

import utilities from "../materials/utilities";

const UserMenu = ({ menuButtonComponent, menuItems }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Fragment>
      <button
        css={utilities.header.clearButton}
        aria-label="Open menu"
        onClick={() => setShowMenu(true)}
        aria-haspopup
      >
        {menuButtonComponent}
      </button>

      {showMenu && (
        <Fragment>
          <div
            css={utilities.header.mask}
            onClick={() => setShowMenu(false)}
            data-testid="menu-mask"
          />
          <div css={utilities.header.popupContainer} role="menu">
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
