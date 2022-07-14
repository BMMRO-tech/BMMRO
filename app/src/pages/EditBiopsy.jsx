/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { getModifiedProperties } from "../utils/math";
import { CollectionNames, generateBiopsyPath } from "../constants/datastore";
import { generateOpenEncounterURL } from "../constants/routes";
import Layout from "../components/Layout";
import BiopsyForm from "../components/BiopsyForm";
import Loader from "../components/Loader";
import utilities from "../materials/utilities";

const EditBiopsy = ({ encounterId, biopsyId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const biopsyPath = generateBiopsyPath(encounterId, biopsyId);

  const handleSubmit = (values) => {
    const modifiedProperties = getModifiedProperties(values, initialValues);

    datastore.updateDocByPath(biopsyPath, modifiedProperties);
    navigate(generateOpenEncounterURL(encounterId));
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);
      console.log("here now");
      console.log(values);

      if (!(typeof values.data === "undefined")) {
        const specimens = await datastore.readDocsByParentPath(
          path,
          CollectionNames.SPECIMENS
        );
        let specimensArray = [];
        for (const specimen of specimens) {
          specimensArray.push(specimen.data);
        }

        values.data.specimens = specimensArray;
      }

      if (!!values.data) {
        setInitialValues(values.data);
      } else {
        navigate(generateOpenEncounterURL(encounterId));
      }
    };
    if (!!datastore) {
      console.log("here");
      getData(biopsyPath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!initialValues ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 css={utilities.form.title}>Edit Biopsy</h1>
          <BiopsyForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            encounterId={encounterId}
          />
        </Fragment>
      )}
    </Layout>
  );
};

export default EditBiopsy;
