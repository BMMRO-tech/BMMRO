/** @jsx jsx */
import { Formik, Form } from "formik";
import { jsx } from "@emotion/core";
import { useContext } from "react";
import { navigate } from "@reach/router";

import NumberInput from "./formFields/NumberInput/NumberInput";
import TextInput from "./formFields/TextInput/TextInput";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import PositionInput from "./formFields/PositionInput/PositionInput";
import Select from "./formFields/Select/Select";
import Button from "./Button";

import { ROUTES } from "../constants/routes";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { CollectionNames } from "../constants/datastore";
import direction from "../constants/formOptions/direction";
import bottomSubstrate from "../constants/formOptions/bottomSubstrate";
import cloudCover from "../constants/formOptions/cloudCover";
import beaufortSeaState from "../constants/formOptions/beaufortSeaState";
import tideState from "../constants/formOptions/tideState";
import behaviour from "../constants/formOptions/behaviour";
import swellWaveHeight from "../constants/formOptions/swellWaveHeight";
import groupCohesion from "../constants/formOptions/groupCohesion";
import utilities from "../materials/utilities";

const HabitatUseForm = ({ openEncounterPath }) => {
  const { datastore } = useContext(FirebaseContext);

  const handleSubmit = (values) => {
    datastore.createSubDoc(
      openEncounterPath,
      CollectionNames.HABITAT_USE,
      values
    );
    navigate(ROUTES.openEncounter);
  };

  return (
    <div css={utilities.sticky.contentContainer}>
      <h1 css={utilities.form.title}>Habitat Use Form</h1>
      <div css={utilities.form.container}>
        <Formik
          initialValues={{
            numberOfAnimals: 1,
            numberOfCalves: "",
            numberOfBoats: 1,
            directionOfTravel: "",
            comments: "",
            waterDepth: "",
            waterTemp: "",
            bottomSubstrate: "",
            cloudCover: "",
            beaufortSeaState: "",
            tideState: "",
            behaviour: "",
            swellWaveHeight: "",
            distance: "",
            bearing: "",
            aspect: "",
            groupCohesion: "",
            groupComposition: "",
            surfaceBout: 0,
            endTime: "",
            startTime: "",
            latitude: "0",
            longitude: "0",
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <div css={utilities.form.fieldsGrid}>
              <NumberInput
                name="numberOfAnimals"
                labelText="Number of Animals"
                minValue={0}
                maxValue={99}
                isInteger
                isShort
              />
              <NumberInput
                name="numberOfCalves"
                labelText="Number of Calves"
                minValue={0}
                maxValue={99}
                isInteger
                isShort
              />
              <NumberInput
                name="numberOfBoats"
                labelText="Number of Boats"
                minValue={0}
                maxValue={999}
                isInteger
                isShort
              />
              <Select
                name="directionOfTravel"
                labelText="Direction of Travel"
                options={direction}
                isShort
              />
              <TextAreaInput
                name="comments"
                labelText="Comments"
                maxLength={500}
              />
              <NumberInput
                name="waterDepth"
                labelText="Water Depth (m)"
                minValue={0}
                maxValue={9999}
                isShort
              />
              <NumberInput
                name="waterTemp"
                labelText="Water Temp (°C)"
                minValue={15}
                maxValue={40}
                isShort
              />
              <Select
                name="bottomSubstrate"
                labelText="Bottom Substrate"
                options={bottomSubstrate}
              />
              <Select
                name="cloudCover"
                labelText="Cloud Cover"
                options={cloudCover}
              />
              <Select
                name="beaufortSeaState"
                labelText="Beaufort Sea State"
                options={beaufortSeaState}
                isShort
              />
              <Select
                name="tideState"
                labelText="Tide State"
                options={tideState}
                isShort
              />
              <Select
                name="behaviour"
                labelText="Behaviour"
                options={behaviour}
              />
              <Select
                name="swellWaveHeight"
                labelText="Swell / Wave height (ft)"
                options={swellWaveHeight}
                isShort
              />
              <NumberInput
                name="distance"
                labelText="Distance (m)"
                minValue={0}
                maxValue={9999}
                isShort
              />
              <NumberInput
                name="bearing"
                labelText="Bearing (°)"
                minValue={0}
                maxValue={360}
                isShort
              />
              <NumberInput
                name="aspect"
                labelText="Aspect (°)"
                minValue={0}
                maxValue={360}
                isShort
              />
              <Select
                name="groupCohesion"
                labelText="Group Cohesion"
                options={groupCohesion}
              />
              <TextInput
                name="groupComposition"
                labelText="Group Composition"
                maxLength={100}
                isShort
              />
              <NumberInput
                name="surfaceBout"
                labelText="Surface Bout"
                minValue={0}
                maxValue={99}
                isInteger
                isShort
              />
              <TimeInput name="endTime" labelText="End Time (hh:mm)" isShort />
              <TimeInput
                name="startTime"
                labelText="Start Time (hh:mm)"
                isRequired
                isShort
                autofill
              />
              <PositionInput
                name="latitude"
                type="latitude"
                labelText="Lat"
                isRequired
                isShort
                autofill
              />
              <PositionInput
                name="longitude"
                type="longitude"
                labelText="Long"
                isRequired
                isShort
                autofill
              />
            </div>
            <div css={utilities.form.legend}>
              <span>*</span>required fields
            </div>
            <div css={utilities.sticky.footerContainer}>
              <Button type="submit">Save habitat use</Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default HabitatUseForm;
