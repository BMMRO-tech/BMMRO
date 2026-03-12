/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import colors from "../../materials/colors";

export const Refresh = ({
  testId,
  refreshLatLong,
  setRefreshLatLong,
  isLoading,
  setIsLoading,
}) => {
  const handleClick = async () => {
    setIsLoading(true);
    setRefreshLatLong(refreshLatLong + 1);
  };

  const basicStyles = css`
    margin-left: -100px;
    margin-top: 20px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border: none;
  `;

  const spinningStyle = css`
    margin-left: -100px;
    margin-top: 20px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border: none;
    animation-name: spin;
    animation-duration: 3000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    svg {
      height: 35px;
      width: 35px;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(-360deg);
      }
    }
  `;

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={handleClick}
      css={isLoading ? spinningStyle : basicStyles}
      disabled={isLoading}
    >
      <svg
        width="35px"
        height="35px"
        fill={isLoading ? colors.mediumGray : colors.black}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 508.48 508.48"
      >
        <g>
          <path d="M114.928 174.046l-28.8 28.8C114.48 109.944 212.776 57.617 305.677 85.969a175.873 175.873 0 0188.851 62.012l25.488-19.312C350.79 37.151 220.481 19.078 128.962 88.304A207.77 207.77 0 0052.64 203.998l-30.016-29.952L0 196.654l68.8 68.8 68.8-68.8-22.672-22.608zM439.68 242.702l-68.8 68.8 22.624 22.624 29.136-29.12c-28.103 93.051-126.317 145.702-219.368 117.599a176.002 176.002 0 01-91.912-65.599l-25.968 18.688a206.719 206.719 0 00135.248 83.824 211.742 211.742 0 0033.76 2.736c95.518-.045 178.669-65.284 201.44-158.048l29.952 29.92 22.688-22.624-68.8-68.8zm-.8 46.096l.816-.816 1.184 1.2-2-.384z" />
        </g>
      </svg>
    </button>
  );
};
