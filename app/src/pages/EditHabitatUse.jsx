/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState } from "react";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";
import Loader from "../components/Loader";
import { navigate } from "@reach/router";
import { generateOpenEncounterURL } from "../constants/routes";
import { CollectionNames } from "../constants/datastore";

const EditHabitatUse = ({ encounterId, habitatUseId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);

  const handleSubmit = (values) => {
    console.log(values);
  };

  useEffect(() => {
    const getData = async () => {
      const values = await datastore.readDocByPath(
        `${CollectionNames.ENCOUNTER}/${encounterId}/${CollectionNames.HABITAT_USE}/${habitatUseId}`
      );

      if (!!values.data) {
        setInitialValues(values.data);
      } else {
        navigate(generateOpenEncounterURL(encounterId));
      }
    };
    if (!!datastore) {
      getData();
    }
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!initialValues ? (
        <Loader />
      ) : (
        <HabitatUseForm
          handleSubmit={handleSubmit}
          initialValues={initialValues}
        />
      )}
    </Layout>
  );
};

export default EditHabitatUse;
