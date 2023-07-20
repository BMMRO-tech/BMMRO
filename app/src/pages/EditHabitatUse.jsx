/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";
import Loader from "../components/Loader";
import {
  generateOpenEncounterURL,
  generateViewHabitatURL,
} from "../constants/routes";
import { generateHabitatUsePath } from "../constants/datastore";
import { getModifiedProperties } from "../utils/math";
import utilities from "../materials/utilities";

const EditHabitatUse = ({ encounterId, habitatUseId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const habitatUsePath = generateHabitatUsePath(encounterId, habitatUseId);

  const handleSubmit = (values) => {
    const modifiedProperties = getModifiedProperties(values, initialValues);

    datastore.updateDocByPath(habitatUsePath, modifiedProperties);
    navigate(generateOpenEncounterURL(encounterId));
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        if (values.data.exported) {
          navigate(generateViewHabitatURL(encounterId, habitatUseId));
        } else {
          setInitialValues(values.data);
        }
      } else {
        navigate(generateOpenEncounterURL(encounterId));
      }
    };
    if (!!datastore) {
      getData(habitatUsePath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!initialValues ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 css={utilities.form.title}>Edit Habitat Use</h1>
          <HabitatUseForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            encounterId={encounterId}
          />
        </Fragment>
      )}
    </Layout>
  );
};

export default EditHabitatUse;
