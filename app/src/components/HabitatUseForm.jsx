/** @jsx jsx */
import { Formik, Form } from "formik";
import { jsx } from "@emotion/core";
import { useContext, Fragment } from "react";
import { navigate } from "@reach/router";

import NumberInput from "./formFields/NumberInput/NumberInput";
import TextInput from "./formFields/TextInput/TextInput";
import TextAreaInput from "./formFields/TextAreaInput/TextAreaInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import PositionInput from "./formFields/PositionInput/PositionInput";
import Select from "./formFields/Select/Select";
import Button from "./Button";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { ROUTES } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";
import direction from "../constants/formOptions/direction";
import bottomSubstrate from "../constants/formOptions/bottomSubstrate";
import cloudCover from "../constants/formOptions/cloudCover";
import beaufortSeaState from "../constants/formOptions/beaufortSeaState";
import tideState from "../constants/formOptions/tideState";
import behaviour from "../constants/formOptions/behaviour";
import swellWaveHeight from "../constants/formOptions/swellWaveHeight";
import groupCohesion from "../constants/formOptions/groupCohesion";

const HabitatUseForm = ({ encounterPath }) => {
  const { datastore } = useContext(FirebaseContext);

  return (
    <Fragment>
      <h1>Habitat Use Form</h1>
      <div>
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
          onSubmit={(values) => {
            datastore.createSubDoc(
              encounterPath,
              CollectionNames.HABITAT_USE,
              values
            );
            navigate(ROUTES.openEncounter);
          }}
        >
          <Form>
            <div>
              <NumberInput
                name="numberOfAnimals"
                labelText="Number of Animals"
                minValue={0}
                maxValue={99}
                isInteger
              />
              <NumberInput
                name="numberOfCalves"
                labelText="Number of Calves"
                minValue={0}
                maxValue={99}
                isInteger
              />
              <NumberInput
                name="numberOfBoats"
                labelText="Number of Boats"
                minValue={0}
                maxValue={999}
                isInteger
              />
              <Select
                name="directionOfTravel"
                labelText="Direction of Travel"
                options={direction}
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
              />
              <NumberInput
                name="waterTemp"
                labelText="Water Temp (°C)"
                minValue={15}
                maxValue={40}
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
              />
              <Select
                name="tideState"
                labelText="Tide State"
                options={tideState}
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
              />
              <NumberInput
                name="distance"
                labelText="Distance (m)"
                minValue={0}
                maxValue={9999}
              />
              <NumberInput
                name="bearing"
                labelText="Bearing (°)"
                minValue={0}
                maxValue={360}
              />
              <NumberInput
                name="aspect"
                labelText="Aspect (°)"
                minValue={0}
                maxValue={360}
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
              />
              <NumberInput
                name="surfaceBout"
                labelText="Surface Bout"
                minValue={0}
                maxValue={99}
                isInteger
              />
              <TimeInput name="endTime" labelText="End Time (hh:mm)" />
              <TimeInput
                name="startTime"
                labelText="Start Time (hh:mm)"
                isRequired
                autofill
              />
              <PositionInput
                name="latitude"
                type="latitude"
                labelText="Lat"
                isRequired
                autofill
              />
              <PositionInput
                name="longitude"
                type="longitude"
                labelText="Long"
                isRequired
                autofill
              />
            </div>
            <p>
              <span>*</span>required fields
            </p>
            <Button type="submit">Submit</Button>
          </Form>
        </Formik>
      </div>
    </Fragment>
  );
};

export default HabitatUseForm;
