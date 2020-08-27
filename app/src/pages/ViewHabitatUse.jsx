/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";
import Loader from "../components/Loader";
import { generateOpenEncounterURL } from "../constants/routes";
import { generateHabitatUsePath } from "../constants/datastore";
import utilities from "../materials/utilities";

const ViewHabitatUse = ({ encounterId, habitatUseId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const habitatUsePath = generateHabitatUsePath(encounterId, habitatUseId);

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        setInitialValues(values.data);
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
          <h1 css={utilities.form.title}>View Habitat Use</h1>
          <HabitatUseForm initialValues={initialValues} isViewOnly />
        </Fragment>
      )}
    </Layout>
  );
};

export default ViewHabitatUse;
