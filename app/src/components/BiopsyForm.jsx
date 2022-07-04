/** @jsx jsx */
import { useEffect, useState } from "react";
import { css, jsx } from "@emotion/core";
import { Link } from "@reach/router";
import { Formik, Form } from "formik";

import utilities from "../materials/utilities";
import Button from "./Button";
import FormSection from "./FormSection";
import ListHeader from "./list/ListHeader";
import biopsyFormDefaults from "../constants/biopsyFormDefaultValues";

import DateInput from "./formFields/DateInput/DateInput";
import TextInput from "./formFields/TextInput/TextInput";
import TimeInput from "./formFields/TimeInput/TimeInput";
import PositionInput from "./formFields/PositionInput/PositionInput";

import Select from "./formFields/Select/Select";
import species from "../constants/formOptions/species";
import { generateOpenEncounterURL } from "../constants/routes";
import { Refresh } from "./icons/Refresh";
import { getPosition } from "./formFields/PositionInput/getPosition";

const BiopsyForm = ({ initialValues, handleSubmit, encounterId }) => {
  const [position, setPosition] = useState({ latitude: "", longitude: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshLatLong, setRefreshLatLong] = useState(0);

  const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
    section: css`
      background-color: none;
    `,
  };

  useEffect(() => {
    (async () => {
      const tempPosition = await getPosition();

      if (tempPosition.position !== null) {
        setPosition(tempPosition.position);
      }
      setIsLoading(false);
    })();
  }, [refreshLatLong]);

  const initValues = initialValues || biopsyFormDefaults;

  return (
    <div css={utilities.sticky.contentContainer}>
      <div css={utilities.form.container}>
        <Formik
          initialValues={initValues}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              <section css={styles.section}>
                <ListHeader title="Biopsy Details" />
                <FormSection>
                  <Select
                    name="species"
                    labelText="Species"
                    options={species}
                    isRequired
                    isDisabled={false}
                  />
                </FormSection>
                <FormSection>
                  <DateInput
                    name="dateTaken"
                    labelText="Date"
                    isRequired
                    isShort
                    notAfter={new Date()}
                    autofill={true}
                  />
                  <TimeInput
                    name="timeTaken"
                    labelText="Time"
                    isShort
                    autofill={true}
                    timeWithSeconds
                    notAfter={values.startTimestamp}
                    isRequired
                  />
                </FormSection>
                <FormSection>
                  <TextInput
                    name="attempt"
                    labelText="Attempt Number"
                    maxLength={255}
                    isShort
                  />
                  <TextInput
                    name="samplerName"
                    labelText="Sampler Name"
                    maxLength={255}
                    isShort
                  />
                </FormSection>

                <br />
                <FormSection isOneLine4Elements>
                  <PositionInput
                    name="latitude"
                    type="latitude"
                    labelText="Lat"
                    isShort
                    isRequired
                    autofill={!initialValues || refreshLatLong !== 0}
                    position={position?.latitude}
                  />
                  <div style={{ display: "flex" }}>
                    <PositionInput
                      name="longitude"
                      type="longitude"
                      labelText="Long"
                      isShort
                      isRequired
                      autofill={!initialValues || refreshLatLong !== 0}
                      position={position?.longitude}
                    />

                    <Refresh
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      setRefreshLatLong={setRefreshLatLong}
                      refreshLatLong={refreshLatLong}
                      testId="Refresh"
                    />
                  </div>
                  <TextInput
                    name="gpsMark"
                    labelText="GPS Mark"
                    maxLength={10}
                    isShort
                  />
                  <TextInput
                    name="totalSpecimens"
                    labelText="Total Specimens"
                    maxLength={10}
                    isShort
                  />
                </FormSection>
              </section>
              <div css={utilities.sticky.footerContainer}>
                <Link to={generateOpenEncounterURL(encounterId)}>
                  <Button
                    styles={styles.cancelButton}
                    variant="secondary"
                    testId={"cancelBiopsy"}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" testId={"saveBiopsy"}>
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BiopsyForm;
