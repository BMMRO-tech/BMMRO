/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";
import Loader from "../components/Loader";
import { generateEncounterPath } from "../constants/datastore";
import { getModifiedProperties } from "../utils/math";
import { generateOpenEncounterURL, ROUTES } from "../constants/routes";

const EditEncounter = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const encounterPath = generateEncounterPath(encounterId);

  const handleSubmit = (values) => {
    const modifiedProperties = getModifiedProperties(values, initialValues);
    datastore.updateDocByPath(encounterPath, modifiedProperties);

    navigate(generateOpenEncounterURL(encounterId));
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        setInitialValues(values.data);
      } else {
        navigate(ROUTES.newEncounter);
      }
    };
    if (!!datastore) {
      getData(encounterPath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!initialValues ? (
        <Loader />
      ) : (
        <EncounterForm
          handleSubmit={handleSubmit}
          initialValues={initialValues}
        />
      )}
    </Layout>
  );
};

export default EditEncounter;
