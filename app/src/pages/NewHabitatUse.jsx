/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useNavigate } from "@reach/router";
import { useContext, useEffect, Fragment } from "react";

import { ROUTES } from "../constants/routes";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { CollectionNames, generateEncounterPath } from "../constants/datastore";
import { generateOpenEncounterURL } from "../constants/routes";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";
import utilities from "../materials/utilities";
import { useState } from "react";
import Loader from "../components/Loader";

const NewHabitatUse = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [isEncounterValid, setIsEncounterValid] = useState(false);
  const navigate = useNavigate();
  const encounterPath = generateEncounterPath(encounterId);

  const handleSubmit = (values) => {
    datastore.createSubDoc(encounterPath, CollectionNames.HABITAT_USE, values);
    navigate(generateOpenEncounterURL(encounterId));
  };

  useEffect(() => {
    const getEncounterData = async (encounterPath) => {
      const encounterResult = await datastore.readDocByPath(encounterPath);

      if (!encounterResult.data) {
        navigate(ROUTES.newEncounter);
        return;
      } else {
        setIsEncounterValid(true);
      }
    };

    if (!!datastore) {
      getEncounterData(encounterPath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!isEncounterValid ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 css={utilities.form.title}>New Habitat Use</h1>
          <HabitatUseForm handleSubmit={handleSubmit} />
        </Fragment>
      )}
    </Layout>
  );
};

export default NewHabitatUse;
