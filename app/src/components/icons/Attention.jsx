/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import colors from "../../materials/colors";

const Attention = () => {
  const styles = {
    attention: css`
      height: 40px;
    `,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={colors.darkRed}
      css={styles.attention}
      version="1.0"
      viewBox="0 0 6877 6877"
    >
      <g>
        <path d="M3439 6340c801,0 1526,-324 2051,-850 526,-525 850,-1250 850,-2051 0,-802 -324,-1527 -850,-2052 -525,-525 -1250,-850 -2051,-850 -802,0 -1527,325 -2052,850 -525,525 -850,1250 -850,2052 0,801 325,1526 850,2051 525,526 1250,850 2052,850zm2431 -470c-622,622 -1482,1007 -2431,1007 -950,0 -1810,-385 -2432,-1007 -622,-622 -1007,-1482 -1007,-2431 0,-950 385,-1810 1007,-2432 622,-622 1482,-1007 2432,-1007 949,0 1809,385 2431,1007 622,622 1007,1482 1007,2432 0,949 -385,1809 -1007,2431zm-2461 -637c-148,0 -269,-121 -269,-269 0,-148 121,-268 269,-268l60 0c148,0 268,120 268,268 0,148 -120,269 -268,269l-60 0zm296 -1157c0,148 -121,268 -269,268 -148,0 -268,-120 -268,-268l0 -2163c0,-148 120,-269 268,-269 148,0 269,121 269,269l0 2163z"></path>
      </g>
    </svg>
  );
};

export default Attention;
