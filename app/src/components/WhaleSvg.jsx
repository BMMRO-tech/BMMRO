/** @jsx jsx */
import { jsx } from "@emotion/core";

const WhaleSvg = ({ setSelectedSection, selectedSection }) => {
  const fillSection = (sectionName) => {
    return selectedSection === sectionName ? "grey" : "transparent";
  };
  return (
    <svg
      width="480.000000pt"
      height="160.750000pt"
      viewBox="0 0 1920.000000 700.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(100.000000,80.000000) scale(2.500000,2.500000)"
        stroke="black"
        strokeWidth="2"
        fill="white"
      >
        <path
          d="M35.07,288.05c-1,2-2.29,3-2.19,4.5.2,2.67.45,4.4,1.13,5.14,2.3,2.48,4.39,2.18,7.61,2.83C48,301.81,54,303,56.7,303.09c0,0,6.33.13,
            19.63.72,6.32.28,10.55.47,14.59.9,11.51,1.24,19.57,4.31,25.39,6.3a239.58,239.58,0,0,0,39.62,9.55c28,4.62,37.21-.17,55.11,8.82,
            3.22,1.62,2.07,1.34,11.89,6.84,17.26,9.67,26,13.43,33.5,16,8.4,2.92,18.31,6.26,21.25,2.52,
            1.23-1.56.81-3.81.54-5.22-.41-2.17-1.63-4.68-13.37-14.56-1-.8-1.43-1.21-1.75-1.46-5.74-4.6-10.06-6.25-15.07-8.9-6.66-3.52-11.34-7.12-11.22-7.31.23-.39,
            18.47,16,43.58,17.65,6.71.45,5.61-.64,20.53-1.08,16.16-.47,25.66.57,38.72,1.26,12.07.64,22.87.55,44.48.36,24.06-.21,53.06-.46,89.15-4.14,35-3.57,
            35.84-6.21,54-5.94,10.46.15,20.33,1.17,32.24-2.7,3.16-1,9.54-3.4,19.45-5.94.76-.2,5.53-1.41,11-2.52A254.68,254.68,0,0,1,625.1,310c18.25-1.14,
            27.38-1.71,39.26-2,29-.65,33.75.69,47.91-4.32,2.08-.74,4.85-2.55,9-2.7,7.76-.29,11.51,4.71,22.33,11.53A112.54,112.54,0,0,0,768.27,324c8.88,3.09,
            19.2,5.47,19.81,4s-9.77-3.12-18-14.05c-7.29-9.67-10.34-16.48-11.17-21.25-.56-3.24,3.6-3.78,3.6-3.78,1.57-.66,
            2.89-.35,3.24-1.08.54-1.11-4.68-1.29-4.92-1.29-13.42.16-32.14.94-32.14.94a134.91,134.91,0,0,0-23.27-19.28c-27.33-17.12-107.79-37.83-107.79-37.83S538,
            215.06,510.18,206c-9.93-3.21-10.87-10.24-11.35-12.61-.09-.46-1.41-7.6,2.7-12.43,2.68-3.14,6-3.36,7.38-7.2.25-.7,1.11-3.07,0-4.68-1.66-2.42-6.63-1.52-10.09-.9a33,33,
            0,0,0-10.81,4c-10.38,6.41-20.63,18.13-31.34,18.91-22.59,1.65-63.78.4-112.2,1.26a578.08,578.08,0,0,0-91.44,8.7c-90.48,17-124.36,43.66-124.36,43.66-12.83-1.06-28.29,
            1.74-38.25,12.63-16.18-1.87-18.92,9.06-21.53,16.26a2.17,2.17,0,0,1-.17.42c-3.25,6.79-21.68,2.33-28.6,6.89C37.53,282.63,36.69,284.94,35.07,288.05Z"
          transform="translate(-31.87 -166.53)"
        />
        <path d="M218.24,64.55" transform="translate(-31.87 -166.53)" />
        <path
          d="M699.8,291.59c10.23,1.1,18.88,7.68,24.83,9.59"
          transform="translate(-31.87 -166.53)"
        />
        <path
          d="M728.7,287.43c5,4.15,3.5,4.25,9.45,6.15"
          transform="translate(-31.87 -166.53)"
        />
        <path d="M107,274.45" transform="translate(-31.87 -166.53)" />
        <path
          d="M107,274.45c-6.83-16.32-16.52-17.12-16.52-17.12"
          transform="translate(-31.87 -166.53)"
        />
        <ellipse cx="97.57" cy="113.91" rx="4" ry="1.25" />
        <path
          d="M67.31,276.21c.18,1.83-3.81,14.54-32.24,11.84"
          transform="translate(-31.87 -166.53)"
        />
      </g>

      <g
        transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
        stroke="#000000"
        strokeWidth="5%"
      >
        <rect
          width="7381"
          height="3500"
          x="0"
          y="-500"
          fill={fillSection("Lower Thoracic")}
          opacity="0.6"
          id="bottomLeft"
          onClick={() => {
            setSelectedSection("Lower Thoracic");
          }}
          button="true"
        />
      </g>
      <g
        transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
        stroke="#000000"
        strokeWidth="5%"
      >
        <rect
          width="7381"
          height="3400"
          x="0"
          y="3000"
          fill={fillSection("Upper Thoracic")}
          opacity="0.6"
          onClick={() => {
            setSelectedSection("Upper Thoracic");
          }}
        />
      </g>
      <g
        transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
        stroke="#000000"
        strokeWidth="5%"
      >
        <rect
          id="topMiddle"
          width="6019"
          height="3400"
          x="7381"
          y="3000"
          fill={fillSection("Upper Dorsal")}
          opacity="0.6"
          onClick={() => {
            setSelectedSection("Upper Dorsal");
          }}
        />
      </g>
      <g
        transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
        stroke="#000000"
        strokeWidth="5%"
      >
        <rect
          width="6600"
          height="3400"
          x="13400"
          y="3000"
          fill={fillSection("Upper Peduncle")}
          opacity="0.6"
          onClick={() => {
            setSelectedSection("Upper Peduncle");
          }}
        />
      </g>
      <g
        transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
        stroke="#000000"
        strokeWidth="5%"
      >
        <rect
          width="6019"
          height="3500"
          x="7381"
          y="-500"
          fill={fillSection("Lower Dorsal")}
          opacity="0.6"
          onClick={() => {
            setSelectedSection("Lower Dorsal");
          }}
        />
      </g>
      <g
        transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
        stroke="#000000"
        strokeWidth="5%"
      >
        <rect
          width="6600"
          height="3500"
          x="13400"
          y="-500"
          fill={fillSection("Lower Peduncle")}
          opacity="0.6"
          data-testid="lowerPeducle"
          onClick={() => {
            setSelectedSection("Lower Peduncle");
          }}
        />
      </g>
    </svg>
  );
};

export default WhaleSvg;
