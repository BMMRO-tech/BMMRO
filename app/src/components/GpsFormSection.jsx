/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useState } from "react";

import PositionInput from "./formFields/PositionInput/PositionInput";
import FormSection from "./FormSection";
import { Refresh } from "./icons/Refresh";
import { getPosition } from "./formFields/PositionInput/getPosition";
import fieldStyles from "./formFields/fieldStyles";
import TextInput from "./formFields/TextInput/TextInput";

const GpsFormSection = ({ initialValues, isViewOnly, isRenderInfoLabel }) => {
  const [position, setPosition] = useState({ latitude: "", longitude: "" });
  const [refreshLatLong, setRefreshLatLong] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const tempPosition = await getPosition();

      if (tempPosition.position !== null) {
        setPosition(tempPosition.position);
      }

      if (tempPosition.error === true) {
        setError(true);
      }

      setIsLoading(false);
    })();
  }, [refreshLatLong]);

  return (
    <FormSection isOneLine4Elements>
      <PositionInput
        name="latitude"
        type="latitude"
        labelText="Lat"
        isShort
        autofill={!initialValues || refreshLatLong !== 0}
        isDisabled={isViewOnly}
        position={position?.latitude}
      />
      <div style={{ display: "flex" }}>
        <PositionInput
          name="longitude"
          type="longitude"
          labelText="Long"
          isShort
          autofill={!initialValues || refreshLatLong !== 0}
          isDisabled={isViewOnly}
          position={position?.longitude}
        />

        {!isViewOnly && (
          <Refresh
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setRefreshLatLong={setRefreshLatLong}
            refreshLatLong={refreshLatLong}
            testId="Refresh"
          />
        )}
      </div>
      <TextInput
        name="gpsMark"
        labelText="GPS mark"
        maxLength={10}
        isShort
        isDisabled={isViewOnly}
      />
      {isRenderInfoLabel && (
        <label
          css={fieldStyles.longRequired}
          data-testid={"positional-data-validation"}
        >
          {" "}
          Please add either latitude and longitude, or a GPS mark.{" "}
        </label>
      )}
      {error && (
        <label css={fieldStyles.longRequired} data-testid={"refreshError"}>
          {" "}
          Geolocation could not be retrieved.{" "}
        </label>
      )}
    </FormSection>
  );
};

export default GpsFormSection;
