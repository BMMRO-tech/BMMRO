/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { useState } from "react";
import WhaleSvg from "./WhaleSvg";
import RadioGroup from "./formFields/RadioGroup/RadioGroup";
import FormSection from "./FormSection";

const DartHitSection = ({ areaHitResult, setAreaHitResult, isViewOnly }) => {
  const [isUpperPeduncleSelected, setIsUpperPeduncleSelected] = useState(
    areaHitResult === "Upper Dorsal"
  );

  return (
    <div>
      <FormSection>
        <WhaleSvg
          setAreaHitResult={setAreaHitResult}
          areaHitResult={areaHitResult}
          setIsUpperPeduncleSelected={setIsUpperPeduncleSelected}
          isViewOnly={isViewOnly}
        />
      </FormSection>
      <FormSection>
        <RadioGroup
          name="whaleSide"
          labelText="Which side was hit?"
          data-testid="whaleSideTestID"
          options={[
            { label: "Left", value: "Left" },
            { label: "Right", value: "Right" },
          ]}
          isDisabled={isViewOnly}
        />
        {isUpperPeduncleSelected && (
          <RadioGroup
            name="dorsalHit"
            labelText="Did it hit the fin?"
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            isDisabled={isViewOnly}
          />
        )}
      </FormSection>
      <br />
      <FormSection>
        <p style={{ color: "red" }}>Area Hit : {areaHitResult}</p>
      </FormSection>
    </div>
  );
};

export default DartHitSection;
