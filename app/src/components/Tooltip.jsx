/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { Fragment, useState } from "react";

import utilities from "../materials/utilities";

const Tooltip = ({ children, text }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Fragment>
      <button
        css={utilities.header.clearButton}
        aria-label="Show tooltip"
        onClick={() => setShowTooltip(true)}
        aria-haspopup
      >
        {children}
      </button>

      {showTooltip && (
        <Fragment>
          <div
            css={utilities.header.mask}
            onClick={() => setShowTooltip(false)}
          />
          <div css={utilities.header.popupContainer}>{text}</div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Tooltip;
