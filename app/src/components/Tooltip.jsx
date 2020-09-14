/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment, useState } from "react";

import utilities from "../materials/utilities";

const Tooltip = ({ children, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Fragment>
      <button
        css={utilities.header.clearButton}
        aria-label="Show tooltip"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-haspopup
      >
        {children}
      </button>

      {showTooltip && (
        <Fragment>
          <div css={utilities.header.popupContainer}>{text}</div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Tooltip;
