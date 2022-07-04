/** @jsx jsx */
import { jsx } from "@emotion/core";

const WhaleImageSvg = ({ createTag, sectionClicked }) => {
  const fillSection = (sectionName) => {
    console.log("sectionClicked: ", sectionClicked);
    console.log("sectionName: ", sectionName);

    return sectionClicked === sectionName ? "grey" : "white";
  };
  return (
    <div>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="480.000000pt"
        height="160.750000pt"
        viewBox="0 0 1920.000000 700.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <metadata>
          Created by potrace 1.14, written by Peter Selinger 2001-2017
        </metadata>
        <g
          transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
          stroke="#000000"
          strokeWidth="5%"
          fill="white"
        >
          <path
            d="M7581 6000 c-29 -21 -25 -36 34 -139 58 -101 75 -160 75 -254 0 -70
                    -25 -191 -39 -191 -41 0 -689 -123 -1027 -196 -424 -90 -635 -144 -856 -218
                    -1590 -531 -2782 -1185 -3582 -1966 -169 -165 -415 -428 -504 -538 -89 -112
                    -183 -259 -277 -439 l-89 -171 -146 -57 c-385 -151 -689 -338 -926 -568 -102
                    -98 -251 -265 -228 -256 5 2 55 34 110 71 148 99 223 132 310 136 104 6 143
                    -20 251 -166 30 -40 90 -102 135 -139 98 -81 132 -126 159 -212 50 -153 30
                    -595 -47 -1055 l-7 -38 65 69 c233 248 437 644 617 1195 61 189 159 536 181
                    644 7 33 17 65 24 73 16 20 406 209 561 271 649 262 1349 418 2075 461 216 13
                    1075 6 1430 -11 113 -5 493 -21 845 -35 352 -13 687 -27 745 -30 997 -52 1787
                    -84 2340 -95 289 -6 892 -24 1340 -41 1232 -45 1389 -49 1865 -49 565 0 1030
                    19 1438 58 42 5 77 7 77 6 0 -1 -76 -104 -169 -227 -185 -245 -308 -424 -298
                    -433 9 -9 183 23 281 51 48 14 88 25 91 25 2 0 -15 -28 -39 -62 -24 -35 -49
                    -73 -55 -86 -12 -23 -12 -23 36 -17 356 50 707 219 966 465 94 89 190 202 345
                    406 l93 121 77 13 c84 13 209 38 492 99 102 22 241 47 310 56 69 9 339 45 600
                    81 679 92 842 112 1045 124 585 34 605 37 743 90 102 39 152 83 152 132 0 29
                    -8 43 -49 81 -27 25 -51 57 -55 71 -16 64 -106 127 -279 195 -178 71 -247 120
                    -267 189 -15 57 -13 88 20 218 44 176 40 362 -11 562 -75 294 -275 464 -664
                    562 -60 16 -240 47 -400 69 -322 46 -439 70 -660 136 -229 68 -319 87 -868
                    185 -1318 235 -2102 344 -2952 409 -536 41 -1195 61 -2040 61 -666 0 -1012
                    -15 -1850 -81 l-390 -30 -116 30 c-192 49 -328 109 -649 281 -80 43 -173 88
                    -207 99 -75 25 -150 27 -182 5z"
          />
          <line x1="7581" y1="0" x2="7581" y2="15000" stroke="white" />
          <line x1="14000" y1="0" x2="14000" y2="15000" stroke="white" />
          <line x1="0" y1="3500" x2="30000" y2="3500" stroke="white" />
        </g>

        <g
          transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
          stroke="#000000"
          strokeWidth="5%"
          fill="black"
        >
          <rect
            width="7581"
            height="4000"
            x="0"
            y="-500"
            fill={fillSection("bottom left")}
            opacity="0.6"
            id="bottomLeft"
            onClick={() => {
              createTag("bottom left");
            }}
            button="true"
          />
        </g>
        <g
          transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
          stroke="#000000"
          strokeWidth="5%"
          fill="black"
        >
          <rect
            width="7581"
            height="2900"
            x="0"
            y="3500"
            fill={fillSection("top left")}
            opacity="0.6"
            onClick={() => {
              createTag("top left");
            }}
          />
        </g>
        <g
          transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
          stroke="#000000"
          strokeWidth="5%"
          fill="black"
        >
          <rect
            id="topMiddle"
            width="6419"
            height="2900"
            x="7581"
            y="3500"
            fill={fillSection("top middle")}
            opacity="0.6"
            onClick={() => {
              createTag("top middle");
            }}
          />
        </g>
        <g
          transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
          stroke="#000000"
          strokeWidth="5%"
          fill="black"
        >
          <rect
            width="6000"
            height="2900"
            x="14000"
            y="3500"
            fill={fillSection("top right")}
            opacity="0.6"
            onClick={() => {
              createTag("top right");
            }}
          />
        </g>
        <g
          transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
          stroke="#000000"
          strokeWidth="5%"
          fill="black"
        >
          <rect
            width="6419"
            height="4000"
            x="7581"
            y="-500"
            fill={fillSection("bottom middle")}
            opacity="0.6"
            onClick={() => {
              createTag("bottom middle");
            }}
          />
        </g>
        <g
          transform="translate(0.000000,643.000000) scale(0.100000,-0.100000)"
          stroke="#000000"
          strokeWidth="5%"
          fill="black"
        >
          <rect
            width="6000"
            height="4000"
            x="14000"
            y="-500"
            fill={fillSection("bottom right")}
            opacity="0.6"
            onClick={() => {
              createTag("bottom right");
            }}
          />
        </g>
      </svg>
    </div>
  );
};

export default WhaleImageSvg;
