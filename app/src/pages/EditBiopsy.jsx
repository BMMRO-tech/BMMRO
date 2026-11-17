/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { getModifiedProperties } from "../utils/math";
import {
  CollectionNames,
  generateBiopsyPath,
  generateSpecimenPath,
} from "../constants/datastore";
import {
  generateOpenEncounterURL,
  generateViewEncounterURL,
} from "../constants/routes";
import Layout from "../components/Layout";
import BiopsyForm from "../components/BiopsyForm";
import Loader from "../components/Loader";
import utilities from "../materials/utilities";
import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";

const EditBiopsy = ({ encounterId, biopsyId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const biopsyPath = generateBiopsyPath(encounterId, biopsyId);

  const saveSpecimens = async (modifiedSpecimens) => {
    const specimens = await datastore.readDocsByParentPath(
      biopsyPath,
      CollectionNames.SPECIMEN,
    );

    for (const specimen of specimens.reverse()) {
      datastore.updateDocByPath(
        generateSpecimenPath(encounterId, biopsyId, specimen.id),
        modifiedSpecimens[0],
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
          modifiedSpecimen,
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

  const handleDelete = () => {
    datastore.updateDocByPath(biopsyPath, { deleted: true });
    navigate(generateOpenEncounterURL(encounterId));
  };

  const styles = {
    biopsyHeader: css`
      display: flex;
    `,
    deleteButton: css`
      margin-left: auto;
    `,
  };

  const deleteButton = (
    <Button
      type="button"
      variant="warning"
      onClick={() => setShowDeleteModal(true)}
      testId="delete-entry-button"
      styles={styles.deleteButton}
    >
      Delete biopsy
    </Button>
  );

  const getSpecimens = async () => {
    const specimens = await datastore.readDocsByParentPath(
      biopsyPath,
      CollectionNames.SPECIMEN,
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

      if (!!values.data && values.data.deleted !== true) {
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
          <div css={styles.biopsyHeader}>
            {" "}
            <h1 css={utilities.form.title}>Edit Biopsy</h1>
            {deleteButton}
          </div>
          <BiopsyForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            encounterId={encounterId}
          />
          {showDeleteModal && (
            <ConfirmationModal
              title="Delete this biopsy?"
              description="This entry will be removed from the encounter."
              confirmLabel="Delete"
              variant="warning"
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteModal(false)}
              testId="delete-confirmation-modal"
              confirmTestId="confirm-delete-button"
              cancelTestId="cancel-delete-button"
            />
          )}
        </Fragment>
      )}
    </Layout>
  );
};

export default EditBiopsy;
