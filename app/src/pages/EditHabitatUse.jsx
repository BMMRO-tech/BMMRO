/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState } from "react";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";
import Loader from "../components/Loader";

const EditHabitatUse = () => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);

  const handleSubmit = (values) => {
    console.log(values);
  };

  useEffect(() => {
    const getData = async () => {
      const values = await datastore.readDocByPath(
        "encounter/0Oyl96tAmQyVazEAcbhR/habitatUse/cct6L8o6wFGZrP01dJxM"
      );
      setInitialValues(values.data);
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
