/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";
import { add } from "date-fns";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import EncounterForm from "../components/EncounterForm";
import Loader from "../components/Loader";
import { generateEncounterPath } from "../constants/datastore";
import {
  generateOpenEncounterURL,
  ROUTES,
  generateViewEncounterURL,
} from "../constants/routes";
import { FormSubmitType, THREE_DAYS_IN_HOURS } from "../constants/forms";
import { getModifiedProperties } from "../utils/math";
import utilities from "../materials/utilities";
import endEntry from "../utils/endEntry";
import { constructDateTime } from "../utils/time";
import DateInvalidModal from "../components/DateInvalidModal";
import handleEditEncounterSubmit from "./handleEncounterSubmit";

const EditEncounter = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [autofillEnd, setAutofillEnd] = useState(false);
  const navigate = useNavigate();
  const encounterPath = generateEncounterPath(encounterId);

  const handleSubmit = (submitType, values) => {
    handleEditEncounterSubmit(values, {
      datastore,
      setAutofillEnd,
      setShowDateModal,
      navigate,
      submitType,
      initialValues,
      encounterId,
    });
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        if (values.data.exported) {
          navigate(generateViewEncounterURL(encounterId));
        } else {
          setInitialValues(values.data);
        }
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
      {showDateModal && (
        <DateInvalidModal closeModal={() => setShowDateModal(false)} />
      )}
      {!initialValues ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 css={utilities.form.title}>
            {initialValues.hasEnded ? "Edit Encounter" : "New Encounter"}
          </h1>
          <EncounterForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            encounterId={encounterId}
            autofillEnd={autofillEnd}
          />
        </Fragment>
      )}
    </Layout>
  );
};

export default EditEncounter;
