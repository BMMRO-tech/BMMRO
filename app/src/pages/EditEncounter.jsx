/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";
import Loader from "../components/Loader";
import { generateEncounterPath } from "../constants/datastore";
import { generateOpenEncounterURL, ROUTES } from "../constants/routes";
import { FormSubmitType } from "../constants/forms";
import { getModifiedProperties } from "../utils/math";
import utilities from "../materials/utilities";

const EditEncounter = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const encounterPath = generateEncounterPath(encounterId);

  const handleSubmit = (submitType, values) => {
    const modifiedProperties = getModifiedProperties(values, initialValues);
    datastore.updateDocByPath(encounterPath, modifiedProperties);

    if (submitType === FormSubmitType.SAVE_AND_END) {
      navigate(ROUTES.encounters);
    } else if (submitType === FormSubmitType.SAVE) {
      navigate(generateOpenEncounterURL(encounterId));
    }
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
        <Fragment>
          <h1 css={utilities.form.title}>Edit Encounter</h1>
          <EncounterForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
          />
        </Fragment>
      )}
    </Layout>
  );
};

export default EditEncounter;
