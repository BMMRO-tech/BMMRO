/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { generateTripPath } from "../constants/datastore";
import { ROUTES, generateViewTripURL } from "../constants/routes";
import utilities from "../materials/utilities";
import DateInvalidModal from "../components/DateInvalidModal";
import TripForm from "../components/TripForm";
import handleEditTripSubmit from "../utils/handleTripSubmit";

const EditTrip = ({ tripId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [autofillEnd, setAutofillEnd] = useState(false);
  const navigate = useNavigate();
  const tripPath = generateTripPath(tripId);

  const handleSubmit = (submitType, values) => {
    handleEditTripSubmit(values, {
      datastore,
      setAutofillEnd,
      setShowDateModal,
      navigate,
      submitType,
      initialValues,
      tripId,
    });
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        if (values.data.exported) {
          navigate(generateViewTripURL(tripId));
        } else {
          setInitialValues(values.data);
        }
      } else {
        navigate(ROUTES.newTrip);
      }
    };
    if (!!datastore) {
      getData(tripPath);
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
          <h1 css={utilities.form.title}>Edit Trip</h1>
          <TripForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            tripId={tripId}
            autofillEnd={autofillEnd}
            datastore={datastore}
          />
        </Fragment>
      )}
    </Layout>
  );
};

export default EditTrip;
