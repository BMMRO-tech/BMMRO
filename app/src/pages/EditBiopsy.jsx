/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { getModifiedProperties } from "../utils/math";
import {
  CollectionNames,
  generateBiopsyPath,
  generateSpecimenPath,
} from "../constants/datastore";
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

  const saveSpecimens = async (modifiedSpecimens) => {
    const specimens = await datastore.readDocsByParentPath(
      biopsyPath,
      CollectionNames.SPECIMEN
    );

    for (const specimen of specimens.reverse()) {
      datastore.updateDocByPath(
        generateSpecimenPath(encounterId, biopsyId, specimen.id),
        modifiedSpecimens[0]
      );
      modifiedSpecimens.shift();
    }

    for (const modifiedSpecimen of modifiedSpecimens) {
      if (
        modifiedSpecimen.specimenNumber ||
        modifiedSpecimen.sampleType ||
        modifiedSpecimen.storageType
      ) {
        datastore.createSubDoc(
          biopsyPath,
          CollectionNames.SPECIMEN,
          modifiedSpecimen
        );
      }
    }
  };

  const handleSubmit = async (values) => {
    const modifiedProperties = getModifiedProperties(values, initialValues);

    if (!!modifiedProperties.specimens) {
      await saveSpecimens(modifiedProperties.specimens.reverse());
    }

    let modifiedPropertiesToSubmit = { ...modifiedProperties };
    delete modifiedPropertiesToSubmit.specimens;

    datastore.updateDocByPath(biopsyPath, modifiedPropertiesToSubmit);
    navigate(generateOpenEncounterURL(encounterId));
  };

  const getSpecimens = async () => {
    const specimens = await datastore.readDocsByParentPath(
      biopsyPath,
      CollectionNames.SPECIMEN
    );
    let specimensArray = [];
    for (const specimen of specimens) {
      specimensArray.push(specimen.data);
    }

    return specimensArray;
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        values.data.specimens = await getSpecimens();
        setInitialValues(values.data);
      } else {
        navigate(generateOpenEncounterURL(encounterId));
      }
    };
    if (!!datastore) {
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
