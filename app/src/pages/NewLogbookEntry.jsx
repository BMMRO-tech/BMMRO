/** @jsx jsx */
import { Fragment, useContext, useEffect, useState } from "react";
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import NewLogbookForm from "../components/NewLogbookForm";
import { CollectionNames, generateTripPath } from "../constants/datastore";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { generateViewTripURL, ROUTES } from "../constants/routes";
import Loader from "../components/Loader";
import { useNavigate } from "@reach/router";

const NewLogbookEntry = ({ tripId }) => {
  const { datastore } = useContext(FirebaseContext);
  const tripPath = generateTripPath(tripId);
  const navigate = useNavigate();
  const [isTripValid, setIsTripValid] = useState(false);

  const handleSubmit = (values) => {
    datastore.createSubDoc(tripPath, CollectionNames.LOGBOOK_ENTRY, values);
    navigate(generateViewTripURL(tripId));
  };

  useEffect(() => {
    const getTripData = async (tripPath) => {
      const tripResult = await datastore.readDocByPath(tripPath);

      if (!tripResult.data) {
        navigate(ROUTES.trips);
        return;
      } else {
        setIsTripValid(true);
      }
    };

    if (!!datastore) {
      getTripData(tripPath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!isTripValid ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 css={utilities.form.title}>New Logbook Entry</h1>
          <NewLogbookForm handleSubmit={handleSubmit} tripId={tripId} />
        </Fragment>
      )}
    </Layout>
  );
};
export default NewLogbookEntry;
