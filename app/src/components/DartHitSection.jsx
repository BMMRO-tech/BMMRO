/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState } from "react";
import WhaleSvg from "./WhaleSvg";
import TextInput from "./formFields/TextInput/TextInput";

const DartHitSection = () => {
  const [selectedSection, setSelectedSection] = useState("");

  return (
    <div>
      {/* <TextInput
                    name="WhaleID"
                    labelText="Whale ID"
                    maxLength={10}
                    isShort
                  /> */}
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
