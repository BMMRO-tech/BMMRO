/** @jsx jsx */
import { jsx } from "@emotion/core";
import WhaleImageSvg from "./WhaleImageSvg";
import { useState } from "react";

const WhaleImageMap = () => {
  const [sectionClicked, setSectionClicked] = useState("");
  const createTag = (section) => {
    console.log(section);
    setSectionClicked(section);
  };
  return (
    <div>
      <h1> whale map</h1>
      <WhaleImageSvg
        id="whaleImage"
        createTag={createTag}
        sectionClicked={sectionClicked}
      />
      <h1>{sectionClicked}</h1>
    </div>
  );
};

export default WhaleImageMap;
