/** @jsx jsx */
import { useContext } from "react";
import { jsx } from "@emotion/core";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import NewLogbookForm from "../components/NewLogbookForm";
import { CollectionNames, generateTripPath } from "../constants/datastore";
import { FirebaseContext } from "../firebaseContext/firebaseContext";
import { generateViewTripURL } from "../constants/routes";
import { navigate } from "@reach/router";

const NewLogbookEntry = ({ tripId }) => {
  const { datastore } = useContext(FirebaseContext);
  const tripPath = generateTripPath(tripId);

  const handleSubmit = (values) => {
    datastore.createSubDoc(tripPath, CollectionNames.LOGBOOK_ENTRY, values);
    navigate(generateViewTripURL(tripId));
  };

  return (
    <Layout hasDefaultPadding={false}>
      <h1 css={utilities.form.title}>New Logbook Entry</h1>
      <NewLogbookForm handleSubmit={handleSubmit} />
    </Layout>
  );
};
export default NewLogbookEntry;
