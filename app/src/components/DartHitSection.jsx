/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState } from "react";
import WhaleSvg from "./WhaleSvg";

const DartHitSection = () => {
  const [selectedSection, setSelectedSection] = useState("");

  return (
    <div>
      <h3>Select Dart Hit Area</h3>
      <WhaleSvg
        setSelectedSection={setSelectedSection}
        selectedSection={selectedSection}
      />
      <p>{selectedSection}</p>
    </div>
  );
};

export default DartHitSection;
