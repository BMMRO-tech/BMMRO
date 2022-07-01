/** @jsx jsx */
import { jsx } from "@emotion/core";
import WhaleImageSvg from "./WhaleImageSvg";

let x = 0;

function myEnterFunction() {
  x++;
  console.log("function called: ", x);
}

const WhaleImageMap = () => {
  return (
    <div>
      <h1> whale map</h1>

      <WhaleImageSvg id="whaleImage" />
      <map name="workmap">
        <area
          onClick={myEnterFunction()}
          shape="rect"
          coords="0,6000,7581,3500"
          alt="lower peduncle"
          href="#"
        />
        {/* <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm"  onClick={myEnterFunction()}/> */}
        {/* <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="coffee.htm" /> */}
      </map>
    </div>
  );
};

export default WhaleImageMap;
